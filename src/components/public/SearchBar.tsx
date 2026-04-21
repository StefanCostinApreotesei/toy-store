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

const MAX_RECENT = 8;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recent-searches");
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveRecentSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT);
      localStorage.setItem("recent-searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((q: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== q);
      localStorage.setItem("recent-searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fillSearchFromRecent = useCallback(
    (q: string) => {
      setQuery(q);
      setShowRecent(false);
      inputRef.current?.focus();
      if (q.length >= 2) {
        setShowSuggestions(true);
        fetchSuggestions(q);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        saveRecentSearch(query.trim());
        router.push(`/cautare?q=${encodeURIComponent(query.trim())}`);
        setShowSuggestions(false);
        setShowRecent(false);
        inputRef.current?.blur();
      }
    },
    [query, router, saveRecentSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      setShowSuggestions(true);
      setShowRecent(false);
    } else {
      setShowSuggestions(false);
      setShowRecent(value.length === 0 && recentSearches.length > 0);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleFocus = () => {
    if (query.length >= 2) {
      setShowSuggestions(true);
    } else if (recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (recentSearches.length > 0) {
      setShowRecent(true);
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowRecent(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSuggestions(false);
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const showClearButton = query.length > 0;

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="Caută produse..."
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-10 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm sm:text-base text-darkgray bg-white transition-all ${
              showClearButton ? "pr-[6.5rem] sm:pr-[8rem]" : "pr-16 sm:pr-20"
            }`}
          />
          {/* Search icon */}
          <svg
            className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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

          {/* Clear (X) button */}
          {showClearButton && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-[4.25rem] sm:right-[5.25rem] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-darkgray rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Șterge căutarea"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-coral text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium hover:bg-coral-dark transition-colors"
          >
            Caută
          </button>
        </div>
      </form>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && !showSuggestions && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          style={{ animation: "dropIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <span className="text-xs font-medium text-darkgray-light">Căutări recente</span>
          </div>
          {recentSearches.map((search) => (
            <div
              key={search}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-lightgray transition-colors group/item"
            >
              {/* Clock icon */}
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              {/* Search text — click to search */}
              <button
                type="button"
                onClick={() => {
                  setQuery(search);
                  saveRecentSearch(search);
                  router.push(`/cautare?q=${encodeURIComponent(search)}`);
                  setShowRecent(false);
                  inputRef.current?.blur();
                }}
                className="flex-1 text-left text-sm text-darkgray truncate hover:text-coral transition-colors"
              >
                {search}
              </button>

              {/* Fill arrow — puts the text into the input */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fillSearchFromRecent(search);
                }}
                className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-coral rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 opacity-0 group-hover/item:opacity-100"
                title="Pune în bara de căutare"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17L7 7m0 0h8m-8 0v8" />
                </svg>
              </button>

              {/* Remove (X) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRecentSearch(search);
                }}
                className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-coral rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 opacity-0 group-hover/item:opacity-100"
                title="Șterge din căutări recente"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          style={{ animation: "dropIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
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
                    saveRecentSearch(query.trim());
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
                onClick={() => {
                  saveRecentSearch(query.trim());
                  setShowSuggestions(false);
                }}
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
