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
      { emoji: "🧸", className: "top-6 left-8 text-8xl lg:text-9xl rotate-12" },
      { emoji: "🎮", className: "top-14 right-12 text-7xl lg:text-8xl -rotate-12" },
      { emoji: "🐕", className: "bottom-8 left-[30%] text-7xl lg:text-8xl rotate-6" },
      { emoji: "🧩", className: "bottom-4 right-8 text-7xl lg:text-8xl -rotate-6" },
      { emoji: "🎨", className: "top-1/2 right-[35%] text-6xl lg:text-7xl rotate-12" },
      { emoji: "🪀", className: "top-4 left-[45%] text-6xl lg:text-7xl -rotate-6" },
      { emoji: "🐱", className: "bottom-16 right-[28%] text-6xl rotate-6" },
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
      { emoji: "🎉", className: "top-6 left-10 text-8xl lg:text-9xl rotate-6" },
      { emoji: "🏷️", className: "top-12 right-14 text-7xl lg:text-8xl -rotate-12" },
      { emoji: "⭐", className: "bottom-6 left-[22%] text-7xl lg:text-8xl rotate-12" },
      { emoji: "🎁", className: "bottom-10 right-10 text-7xl lg:text-8xl -rotate-6" },
      { emoji: "💎", className: "top-1/2 right-[30%] text-6xl lg:text-7xl rotate-6" },
      { emoji: "🎀", className: "top-6 left-[50%] text-6xl lg:text-7xl -rotate-12" },
      { emoji: "🛍️", className: "bottom-20 left-10 text-6xl rotate-6" },
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
      { emoji: "🚚", className: "top-6 left-6 text-8xl lg:text-9xl rotate-6" },
      { emoji: "📦", className: "top-16 right-12 text-7xl lg:text-8xl -rotate-12" },
      { emoji: "✅", className: "bottom-8 left-[28%] text-7xl lg:text-8xl rotate-12" },
      { emoji: "🇷🇴", className: "bottom-4 right-6 text-7xl lg:text-8xl -rotate-6" },
      { emoji: "🏠", className: "top-1/2 right-[32%] text-6xl lg:text-7xl rotate-6" },
      { emoji: "💌", className: "top-4 left-[48%] text-6xl lg:text-7xl -rotate-6" },
      { emoji: "🕐", className: "bottom-20 left-8 text-6xl rotate-12" },
    ],
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      // Brief fade-out, then switch
      setTimeout(() => {
        setCurrent(index);
        setContentKey((k) => k + 1);
        // Allow content animation to play
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    },
    [isTransitioning, current]
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
      {/* Background — smooth gradient transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]`}
      />

      {/* Decorative emojis — hidden on mobile */}
      <div className="absolute inset-0 opacity-20 lg:opacity-25 hidden sm:block pointer-events-none">
        {slide.emojis.map((e, i) => (
          <div
            key={`${current}-${i}`}
            className={`absolute ${e.className} drop-shadow-sm`}
            style={{
              animation: `float ${3 + (i % 3) * 0.5}s ease-in-out ${i * 0.4}s infinite`,
              ["--rotate" as string]: e.className.includes("rotate-12") ? "12deg" : e.className.includes("-rotate-12") ? "-12deg" : e.className.includes("rotate-6") ? "6deg" : "-6deg",
            }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 md:py-24 relative z-10">
        <div
          key={contentKey}
          className={`max-w-2xl transition-opacity duration-300 ease-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          style={!isTransitioning ? { animation: "slideFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)" } : undefined}
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">
            {slide.title}
            <br />
            <span className="text-darkgray">{slide.highlight}</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-5 sm:mb-8">
            {slide.description}
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href={slide.cta.href}
              className="bg-white text-coral font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-lightgray hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-lg text-sm sm:text-base"
            >
              {slide.cta.label}
            </Link>
            {slide.ctaSecondary && (
              <Link
                href={slide.ctaSecondary.href}
                className="bg-darkgray text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-darkgray-light hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-lg text-sm sm:text-base"
              >
                {slide.ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/40 hover:scale-110 rounded-full flex items-center justify-center text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-sm active:scale-95"
          aria-label="Slide anterior"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/40 hover:scale-110 rounded-full flex items-center justify-center text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-sm active:scale-95"
          aria-label="Slide următor"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === current ? "w-8 bg-white shadow-sm" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
