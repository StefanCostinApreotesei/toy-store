"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { CategoryTree } from "@/types/category";

interface MegaMenuProps {
  categories: CategoryTree;
}

export default function MegaMenu({ categories }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-coral text-white rounded-lg font-medium hover:bg-coral-dark transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Categorii
        <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 min-w-[600px] p-6"
        >
          <div className="border-t-4 border-coral absolute top-0 left-6 right-6 rounded-t" />
          <div className="grid grid-cols-2 gap-8">
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/categorii/${category.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-darkgray hover:text-coral transition-colors block mb-3"
                >
                  {category.name}
                </Link>
                {category.description && (
                  <p className="text-sm text-darkgray-light mb-3">
                    {category.description}
                  </p>
                )}
                <ul className="space-y-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/categorii/${category.slug}/${sub.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-sm text-darkgray hover:text-coral transition-colors group"
                      >
                        <span className="w-1.5 h-1.5 bg-coral/40 rounded-full group-hover:bg-coral transition-colors" />
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/categorii"
              onClick={() => setIsOpen(false)}
              className="text-sm text-coral font-medium hover:text-coral-dark transition-colors"
            >
              Vezi toate categoriile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
