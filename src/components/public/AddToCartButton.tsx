"use client";

import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  stock: number;
  slug: string;
  imageUrl?: string;
}

export default function AddToCartButton({
  productId,
  productName,
  price,
  stock,
  slug,
  imageUrl,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId,
      name: productName,
      price,
      slug,
      imageUrl,
      maxStock: stock,
    });
    setAdded(true);
    addToast(`${productName} a fost adăugat în coș`);
    setTimeout(() => setAdded(false), 2000);
  };

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full py-3 px-6 rounded-lg bg-gray-300 text-gray-500 font-bold cursor-not-allowed transition-opacity duration-300"
      >
        Stoc epuizat
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ${
        added
          ? "bg-green text-white shadow-lg"
          : "bg-coral text-white hover:bg-coral-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      }`}
      style={added ? { animation: "successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1)" } : undefined}
    >
      <span className={`inline-flex items-center gap-2 transition-all duration-300 ${added ? "tracking-wider" : ""}`}>
        {added ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Adăugat în coș!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Adaugă în coș
          </>
        )}
      </span>
    </button>
  );
}
