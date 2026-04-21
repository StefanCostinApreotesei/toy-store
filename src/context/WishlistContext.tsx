"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

interface WishlistContextType {
  items: string[]; // product IDs
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function storageKey(userId?: string | null): string {
  return userId ? `jucariistore-wishlist-${userId}` : "jucariistore-wishlist-guest";
}

function loadWishlist(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(key: string, items: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const keyRef = useRef("");

  // Load / reload when session resolves or user changes
  useEffect(() => {
    if (status === "loading") return;

    const key = storageKey(session?.user?.id);
    if (key !== keyRef.current) {
      keyRef.current = key;
      setItems(loadWishlist(key));
    }
    if (!ready) setReady(true);
  }, [session?.user?.id, status, ready]);

  // Persist on change
  useEffect(() => {
    if (ready && keyRef.current) {
      saveWishlist(keyRef.current, items);
    }
  }, [items, ready]);

  const toggleItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleItem,
        isInWishlist,
        clearWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
