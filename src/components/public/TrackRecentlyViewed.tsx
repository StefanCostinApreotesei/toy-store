"use client";

import { useEffect } from "react";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: { url: string; alt: string | null }[];
}

interface TrackRecentlyViewedProps {
  product: ProductData;
}

export default function TrackRecentlyViewed({ product }: TrackRecentlyViewedProps) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recently-viewed");
      const list: ProductData[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter((p) => p.id !== product.id);
      filtered.unshift(product);
      localStorage.setItem(
        "recently-viewed",
        JSON.stringify(filtered.slice(0, 20))
      );
    } catch {
      // ignore storage errors
    }
  }, [product]);

  return null;
}
