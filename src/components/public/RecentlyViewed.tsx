"use client";

import { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: { url: string; alt: string | null }[];
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recently-viewed");
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        setProducts(parsed.slice(0, 10));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-darkgray mb-6">
        Vizualizate recent
      </h2>
      <ProductCarousel products={products} />
    </section>
  );
}
