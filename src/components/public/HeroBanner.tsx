"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Slide {
  title: string;
  highlight: string;
  description: string;
  cta: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  gradient: string;
  emojis: { emoji: string; className: string }[];
}

const slides: Slide[] = [
  {
    title: "Jucării pentru",
    highlight: "toată familia",
    description:
      "Descoperă cele mai frumoase jucării pentru copii și animale de companie. Calitate, siguranță și distracție garantată!",
    cta: { label: "Jucării Copii", href: "/categorii/jucarii-copii" },
    ctaSecondary: { label: "Jucării Animale", href: "/categorii/jucarii-animale" },
    gradient: "from-coral via-coral-light to-yellow",
    emojis: [
      { emoji: "🧸", className: "top-10 left-10 text-8xl rotate-12" },
      { emoji: "🎮", className: "top-20 right-20 text-7xl -rotate-12" },
      { emoji: "🐕", className: "bottom-10 left-1/3 text-6xl rotate-6" },
      { emoji: "🧩", className: "bottom-5 right-10 text-7xl -rotate-6" },
    ],
  },
  {
    title: "Reduceri de",
    highlight: "până la 40%",
    description:
      "Profită de ofertele speciale la jucăriile preferate. Stocuri limitate — comandă acum!",
    cta: { label: "Vezi ofertele", href: "/categorii" },
    gradient: "from-purple-600 via-purple-500 to-pink-400",
    emojis: [
      { emoji: "🎉", className: "top-8 left-12 text-8xl rotate-6" },
      { emoji: "🏷️", className: "top-16 right-16 text-7xl -rotate-12" },
      { emoji: "⭐", className: "bottom-8 left-1/4 text-6xl rotate-12" },
      { emoji: "🎁", className: "bottom-12 right-12 text-7xl -rotate-6" },
    ],
  },
  {
    title: "Livrare gratuită",
    highlight: "peste 200 Lei",
    description:
      "Comandă de peste 200 Lei și beneficiezi de livrare gratuită în toată România. Retur gratuit 30 de zile.",
    cta: { label: "Cumpără acum", href: "/categorii" },
    gradient: "from-green via-emerald-400 to-teal-400",
    emojis: [
      { emoji: "🚚", className: "top-8 left-8 text-8xl rotate-6" },
      { emoji: "📦", className: "top-20 right-16 text-7xl -rotate-12" },
      { emoji: "✅", className: "bottom-10 left-1/3 text-6xl rotate-12" },
      { emoji: "🇷🇴", className: "bottom-6 right-8 text-7xl -rotate-6" },
    ],
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-500`}
      />

      {/* Decorative emojis */}
      <div className="absolute inset-0 opacity-10">
        {slide.emojis.map((e, i) => (
          <div key={i} className={`absolute ${e.className}`}>
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div
          className={`max-w-2xl transition-all duration-500 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            {slide.title}
            <br />
            <span className="text-darkgray">{slide.highlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            {slide.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={slide.cta.href}
              className="bg-white text-coral font-bold px-6 py-3 rounded-lg hover:bg-lightgray transition-colors shadow-lg"
            >
              {slide.cta.label}
            </Link>
            {slide.ctaSecondary && (
              <Link
                href={slide.ctaSecondary.href}
                className="bg-darkgray text-white font-bold px-6 py-3 rounded-lg hover:bg-darkgray-light transition-colors shadow-lg"
              >
                {slide.ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          aria-label="Slide anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          aria-label="Slide următor"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
