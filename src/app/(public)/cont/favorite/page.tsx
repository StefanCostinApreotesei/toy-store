"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import ProductGrid from "@/components/public/ProductGrid";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: { url: string; alt: string | null }[];
}

export default function FavoritesPage() {
  const { items, totalItems } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        items.forEach((id) => params.append("ids", id));

        const res = await fetch(`/api/products/by-ids?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load wishlist products:", err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [items]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-darkgray">Favorite</h1>
        {totalItems > 0 && (
          <span className="text-sm text-darkgray-light">
            {totalItems} {totalItems === 1 ? "produs" : "produse"}
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">⏳</span>
          <p className="text-darkgray-light">Se încarcă...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </span>
          <h2 className="text-xl font-bold text-darkgray mb-2">
            Niciun produs favorit
          </h2>
          <p className="text-darkgray-light mb-6">
            Adaugă produse la favorite apăsând pe inimioară
          </p>
          <Link
            href="/categorii"
            className="inline-block bg-coral text-white font-bold px-6 py-3 rounded-lg hover:bg-coral-dark transition-colors"
          >
            Explorează produse
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
