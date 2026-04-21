"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
  prefix?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selectează...",
  searchPlaceholder = "Caută...",
  emptyMessage = "Niciun rezultat",
  disabled,
  required,
  name,
  id,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  const MAX_RENDER = 100;
  const { filtered, totalMatches } = useMemo(() => {
    const q = query.trim();
    const norm = (s: string) =>
      s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    if (!q) {
      return { filtered: options.slice(0, MAX_RENDER), totalMatches: options.length };
    }
    const nq = norm(q);
    const matches = options.filter((o) => norm(o.label).includes(nq));
    return { filtered: matches.slice(0, MAX_RENDER), totalMatches: matches.length };
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const choose = (opt: Option) => {
    onChange(opt.value);
    setOpen(false);
    setQuery("");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[activeIndex];
      if (opt) choose(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}

      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border text-left transition-colors ${
          open ? "border-coral ring-2 ring-coral/20" : "border-gray-300"
        } ${disabled ? "bg-gray-50 text-darkgray-light cursor-not-allowed" : "bg-white hover:border-gray-400"} focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20`}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          {selected?.prefix && (
            <span className="flex-shrink-0">{selected.prefix}</span>
          )}
          <span
            className={`truncate ${selected ? "text-darkgray" : "text-darkgray-light"}`}
          >
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 text-darkgray-light transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-darkgray-light pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKey}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-200 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
              />
            </div>
          </div>
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-64 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-darkgray-light text-center">
                {emptyMessage}
              </li>
            ) : (
              <>
              {filtered.map((opt, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => choose(opt)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${
                      isActive ? "bg-coral/10" : ""
                    } ${isSelected ? "font-medium text-coral" : "text-darkgray"}`}
                  >
                    {opt.prefix && <span className="flex-shrink-0">{opt.prefix}</span>}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-coral flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </li>
                );
              })}
              {totalMatches > filtered.length && (
                <li className="px-4 py-2 text-xs text-darkgray-light text-center border-t border-gray-100 bg-gray-50">
                  Afișez primele {filtered.length} din {totalMatches} — tastează pentru a restrânge
                </li>
              )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
