import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-coral via-coral-light to-yellow overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl rotate-12">🧸</div>
        <div className="absolute top-20 right-20 text-7xl -rotate-12">🎮</div>
        <div className="absolute bottom-10 left-1/3 text-6xl rotate-6">🐕</div>
        <div className="absolute bottom-5 right-10 text-7xl -rotate-6">🧩</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
            Jucării pentru
            <br />
            <span className="text-darkgray">toată familia</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Descoperă cele mai frumoase jucării pentru copii și animale de companie.
            Calitate, siguranță și distracție garantată!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/categorii/jucarii-copii"
              className="bg-white text-coral font-bold px-6 py-3 rounded-lg hover:bg-lightgray transition-colors shadow-lg"
            >
              Jucării Copii
            </Link>
            <Link
              href="/categorii/jucarii-animale"
              className="bg-darkgray text-white font-bold px-6 py-3 rounded-lg hover:bg-darkgray-light transition-colors shadow-lg"
            >
              Jucării Animale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
