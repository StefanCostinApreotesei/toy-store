"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistIcon() {
  const { totalItems } = useWishlist();

  return (
    <Link
      href="/cont/favorite"
      className="relative flex items-center gap-1.5 text-darkgray hover:text-coral transition-colors"
    >
      <div className="relative">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-coral text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>
      <span className="text-sm font-medium hidden lg:block">Favorite</span>
    </Link>
  );
}
