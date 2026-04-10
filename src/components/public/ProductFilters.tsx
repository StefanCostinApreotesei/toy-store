"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useTransition } from "react";

const SORT_OPTIONS = [
  { value: "newest", label: "Cele mai noi" },
  { value: "price-asc", label: "Preț crescător" },
  { value: "price-desc", label: "Preț descrescător" },
  { value: "name-asc", label: "Nume A-Z" },
] as const;

export default function ProductFilters() {
  return (
    <Suspense>
      <ProductFiltersContent />
    </Suspense>
  );
}

function ProductFiltersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sortare") || "newest";
  const currentMinPrice = searchParams.get("pret_min") || "";
  const currentMaxPrice = searchParams.get("pret_max") || "";
  const currentInStock = searchParams.get("in_stoc") === "1";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 when filters change
      params.delete("pagina");

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = (formData.get("pret_min") as string).trim();
    const max = (formData.get("pret_max") as string).trim();
    updateParams({ pret_min: min || null, pret_max: max || null });
  };

  const hasActiveFilters =
    currentMinPrice || currentMaxPrice || currentInStock || currentSort !== "newest";

  const clearFilters = () => {
    updateParams({
      pret_min: null,
      pret_max: null,
      in_stoc: null,
      sortare: null,
    });
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 mb-6 transition-opacity ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) =>
          updateParams({
            sortare: e.target.value === "newest" ? null : e.target.value,
          })
        }
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-darkgray focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Price range */}
      <form
        onSubmit={handlePriceSubmit}
        className="flex items-center gap-1.5"
      >
        <input
          type="number"
          name="pret_min"
          defaultValue={currentMinPrice}
          placeholder="Preț min"
          min={0}
          step="any"
          className="w-24 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
        />
        <span className="text-darkgray-light text-sm">—</span>
        <input
          type="number"
          name="pret_max"
          defaultValue={currentMaxPrice}
          placeholder="Preț max"
          min={0}
          step="any"
          className="w-24 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
        />
        <button
          type="submit"
          className="text-sm bg-coral text-white px-3 py-2 rounded-lg hover:bg-coral-dark transition-colors"
        >
          Filtrare
        </button>
      </form>

      {/* In stock only */}
      <label className="flex items-center gap-2 text-sm text-darkgray cursor-pointer select-none">
        <input
          type="checkbox"
          checked={currentInStock}
          onChange={(e) =>
            updateParams({ in_stoc: e.target.checked ? "1" : null })
          }
          className="w-4 h-4 rounded border-gray-300 text-coral focus:ring-coral/20"
        />
        Doar in stoc
      </label>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-coral hover:text-coral-dark transition-colors ml-auto"
        >
          Resetare filtre
        </button>
      )}
    </div>
  );
}
