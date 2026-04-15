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
        className="w-full py-3 px-6 rounded-lg bg-gray-300 text-gray-500 font-bold cursor-not-allowed"
      >
        Stoc epuizat
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-3 px-6 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] ${
        added
          ? "bg-green text-white"
          : "bg-coral text-white hover:bg-coral-dark"
      }`}
    >
      {added ? "✓ Adăugat în coș!" : "Adaugă în coș"}
    </button>
  );
}
