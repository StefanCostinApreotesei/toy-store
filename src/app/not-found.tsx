import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightgray">
      <div className="text-center">
        <span className="text-8xl block mb-4">🧸</span>
        <h1 className="text-6xl font-extrabold text-coral mb-2">404</h1>
        <p className="text-xl text-darkgray mb-6">
          Pagina pe care o cauți nu a fost găsită
        </p>
        <Link
          href="/"
          className="inline-block bg-coral text-white font-bold px-6 py-3 rounded-lg hover:bg-coral-dark transition-colors"
        >
          Înapoi la magazin
        </Link>
      </div>
    </div>
  );
}
