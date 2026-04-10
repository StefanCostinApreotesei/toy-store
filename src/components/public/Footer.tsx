import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-darkgray text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold">
              <span className="text-coral">Jucării</span>
              <span className="text-white">Shop</span>
            </span>
            <p className="mt-3 text-sm text-gray-300">
              Magazin online cu jucării pentru copii și animale de companie.
              Calitate, siguranță și distracție garantată.
            </p>
          </div>

          {/* Jucării Copii */}
          <div>
            <h3 className="font-semibold mb-3 text-yellow">Jucării Copii</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/categorii/jucarii-copii/educationale" className="hover:text-coral transition-colors">
                  Jucării educaționale
                </Link>
              </li>
              <li>
                <Link href="/categorii/jucarii-copii/lego" className="hover:text-coral transition-colors">
                  Jucării LEGO
                </Link>
              </li>
            </ul>
          </div>

          {/* Jucării Animale */}
          <div>
            <h3 className="font-semibold mb-3 text-yellow">Jucării Animale</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/categorii/jucarii-animale/caini" className="hover:text-coral transition-colors">
                  Jucării pentru câini
                </Link>
              </li>
              <li>
                <Link href="/categorii/jucarii-animale/pisici" className="hover:text-coral transition-colors">
                  Jucării pentru pisici
                </Link>
              </li>
              <li>
                <Link href="/categorii/jucarii-animale/hamsteri" className="hover:text-coral transition-colors">
                  Jucării pentru hamsteri
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-3 text-yellow">Informații</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-coral transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cont" className="hover:text-coral transition-colors">
                  Contul meu
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-600 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} JucăriiShop. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
