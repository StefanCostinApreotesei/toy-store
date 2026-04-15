"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/cautare?q=${encodeURIComponent(query.trim())}`);
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [query, router]
  );

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}&limit=5`);
      if (res.ok) {
        setSuggestions(await res.json());
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length >= 2);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder="Caută produse..."
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-darkgray bg-white transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-coral text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-coral-dark transition-colors"
          >
            Caută
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {loading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-sm text-darkgray-light">Se caută...</div>
          ) : suggestions.length === 0 && query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-darkgray-light">
              Niciun rezultat pentru &quot;{query}&quot;
            </div>
          ) : (
            <>
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/produs/${product.slug}`}
                  onClick={() => {
                    setShowSuggestions(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-lightgray transition-colors"
                >
                  <div className="w-10 h-10 bg-lightgray rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">🎁</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-darkgray font-medium truncate">{product.name}</p>
                    <p className="text-sm text-coral font-bold">
                      {product.price.toFixed(2).replace(".", ",")} Lei
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href={`/cautare?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setShowSuggestions(false)}
                className="block px-4 py-3 text-center text-sm font-medium text-coral hover:bg-lightgray transition-colors border-t border-gray-100"
              >
                Vezi toate rezultatele →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
