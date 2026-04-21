"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { CategoryTree } from "@/types/category";

interface MegaMenuProps {
  categories: CategoryTree;
}

export default function MegaMenu({ categories }: MegaMenuProps) {
  // null = closed, "hover" = opened by hover, "click" = opened by click (sticky)
  const [openMode, setOpenMode] = useState<null | "hover" | "click">(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOpen = openMode !== null;

  // Click outside closes menu (any mode)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMode(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll only on mobile when menu is open
  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClick = () => {
    setOpenMode(openMode === "click" ? null : "click");
  };

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024 && openMode !== "click") {
      setOpenMode("hover");
    }
  };

  const handleMouseLeave = () => {
    if (openMode === "hover") {
      setOpenMode(null);
    }
  };

  const close = () => setOpenMode(null);

  return (
    <div ref={menuRef} className="relative" onMouseLeave={handleMouseLeave}>
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className="flex items-center gap-2 px-3 lg:px-4 py-2.5 bg-coral text-white rounded-lg font-medium hover:bg-coral-dark transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">Categorii</span>
        <svg className={`w-4 h-4 transition-transform hidden sm:block ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            style={{ animation: "fadeIn 0.25s ease-out forwards" }}
            onClick={close}
          />

          {/* Mobile drawer */}
          <div
            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 lg:hidden overflow-y-auto shadow-2xl"
            style={{ animation: "drawerIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-lg font-bold text-darkgray">Categorii</span>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-lightgray"
              >
                <svg className="w-5 h-5 text-darkgray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-4">
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/categorii/${category.slug}`}
                    onClick={close}
                    className="text-base font-bold text-darkgray hover:text-coral transition-colors block mb-2"
                  >
                    {category.name}
                  </Link>
                  <ul className="space-y-1.5 pl-3 border-l-2 border-coral/20">
                    {category.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/categorii/${category.slug}/${sub.slug}`}
                          onClick={close}
                          className="text-sm text-darkgray-light hover:text-coral transition-colors block py-1"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100 space-y-2">
              <Link
                href="/categorii"
                onClick={close}
                className="block text-sm text-coral font-medium py-2"
              >
                Vezi toate categoriile →
              </Link>
              <Link
                href="/cont"
                onClick={close}
                className="block text-sm text-darkgray-light hover:text-coral py-2"
              >
                Contul meu
              </Link>
              <Link
                href="/cont/comenzi"
                onClick={close}
                className="block text-sm text-darkgray-light hover:text-coral py-2"
              >
                Comenzile mele
              </Link>
              <Link
                href="/contact"
                onClick={close}
                className="block text-sm text-darkgray-light hover:text-coral py-2"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop dropdown */}
          <div
            className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 min-w-[600px] p-6 hidden lg:block"
            style={{ animation: "dropIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <div className="border-t-4 border-coral absolute top-0 left-6 right-6 rounded-t" />
            <div className="grid grid-cols-2 gap-8">
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/categorii/${category.slug}`}
                    onClick={close}
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
                          onClick={close}
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
                onClick={close}
                className="text-sm text-coral font-medium hover:text-coral-dark transition-colors"
              >
                Vezi toate categoriile →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
