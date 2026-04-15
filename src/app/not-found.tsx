import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightgray px-4">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-6">
          <span className="text-[120px] leading-none block">🧸</span>
          <span className="absolute -top-2 -right-4 text-6xl font-extrabold text-coral">?</span>
        </div>
        <h1 className="text-7xl font-extrabold text-coral mb-4">404</h1>
        <h2 className="text-xl font-bold text-darkgray mb-3">
          Pagina nu a fost găsită
        </h2>
        <p className="text-darkgray-light mb-8">
          Se pare că această pagină s-a rătăcit. Hai să te ajutăm să găsești
          ce cauți.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-coral text-white font-bold px-6 py-3 rounded-lg hover:bg-coral-dark transition-colors"
          >
            Pagina principală
          </Link>
          <Link
            href="/categorii"
            className="bg-white text-darkgray font-bold px-6 py-3 rounded-lg border border-gray-200 hover:bg-lightgray transition-colors"
          >
            Explorează categorii
          </Link>
        </div>
        <p className="mt-8 text-sm text-darkgray-light">
          Ai nevoie de ajutor?{" "}
          <Link href="/contact" className="text-coral font-medium hover:text-coral-dark">
            Contactează-ne
          </Link>
        </p>
      </div>
    </div>
  );
}
