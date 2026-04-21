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

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug: string;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function storageKey(userId?: string | null): string {
  return userId ? `jucariistore-cart-${userId}` : "jucariistore-cart-guest";
}

function loadCart(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const keyRef = useRef("");

  // Load / reload when session resolves or user changes
  useEffect(() => {
    if (status === "loading") return;

    const key = storageKey(session?.user?.id);
    if (key !== keyRef.current) {
      keyRef.current = key;
      setItems(loadCart(key));
    }
    if (!ready) setReady(true);
  }, [session?.user?.id, status, ready]);

  // Persist on change
  useEffect(() => {
    if (ready && keyRef.current) {
      saveCart(keyRef.current, items);
    }
  }, [items, ready]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === newItem.productId);
        if (existing) {
          const newQty = Math.min(
            existing.quantity + (newItem.quantity || 1),
            newItem.maxStock
          );
          return prev.map((i) =>
            i.productId === newItem.productId
              ? { ...i, quantity: newQty }
              : i
          );
        }
        return [
          ...prev,
          {
            ...newItem,
            quantity: Math.min(newItem.quantity || 1, newItem.maxStock),
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.maxStock) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
