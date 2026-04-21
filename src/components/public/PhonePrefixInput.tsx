"use client";

import { useEffect, useRef, useState } from "react";
import {
  COUNTRY_PREFIXES,
  DEFAULT_COUNTRY_PREFIX,
  isPhoneValidForCountry,
  normalizePhoneDigits,
  type CountryPrefix,
} from "@/lib/data/country-prefixes";

interface PhonePrefixInputProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  id?: string;
}

function detectInitialPrefix(raw: string | undefined): CountryPrefix {
  if (!raw) return DEFAULT_COUNTRY_PREFIX;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("+")) return DEFAULT_COUNTRY_PREFIX;
  const sorted = [...COUNTRY_PREFIXES].sort((a, b) => b.dial.length - a.dial.length);
  return sorted.find((p) => trimmed.startsWith(p.dial)) ?? DEFAULT_COUNTRY_PREFIX;
}

export default function PhonePrefixInput({
  name,
  required,
  defaultValue,
  placeholder = "7xx xxx xxx",
  id,
}: PhonePrefixInputProps) {
  const initialPrefix = detectInitialPrefix(defaultValue);
  const initialLocal = defaultValue
    ? defaultValue.replace(initialPrefix.dial, "").trim()
    : "";

  const [prefix, setPrefix] = useState<CountryPrefix>(initialPrefix);
  const [local, setLocal] = useState(initialLocal);
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const combined = local.trim()
    ? `${prefix.dial} ${normalizePhoneDigits(local)}`
    : "";

  const valid = isPhoneValidForCountry(local, prefix);
  const showError = touched && local.trim() !== "" && !valid;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const filtered = COUNTRY_PREFIXES.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.dial.includes(q) ||
      p.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={combined} required={required} />

      <div
        className={`flex items-stretch rounded-lg border overflow-hidden transition-colors ${
          showError
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-300 focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Selectează prefixul țării"
          className="flex items-center gap-1.5 px-3 bg-lightgray hover:bg-gray-200 transition-colors border-r border-gray-300 flex-shrink-0"
        >
          <span className="text-base">{prefix.flag}</span>
          <span className="text-sm font-medium text-darkgray">{prefix.dial}</span>
          <svg
            className={`w-3.5 h-3.5 text-darkgray-light transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 focus:outline-none bg-white"
        />
      </div>

      {showError && (
        <p className="mt-1 text-xs text-red-500">
          Număr invalid pentru {prefix.name} (așteptăm{" "}
          {prefix.minLength === prefix.maxLength
            ? `${prefix.minLength} cifre`
            : `${prefix.minLength}–${prefix.maxLength} cifre`}
          ).
        </p>
      )}

      {open && (
        <div className="absolute z-30 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Caută țara..."
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-darkgray-light text-center">
                Nicio țară găsită
              </li>
            ) : (
              filtered.map((p) => {
                const selected = p.code === prefix.code;
                return (
                  <li
                    key={p.code}
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setPrefix(p);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-coral/10 ${
                      selected ? "font-medium text-coral bg-coral/5" : "text-darkgray"
                    }`}
                  >
                    <span className="text-base">{p.flag}</span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-darkgray-light">{p.dial}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
