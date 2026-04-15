import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "./SearchBar";
import MegaMenu from "./MegaMenu";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";

async function getCategories() {
  return prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
  });
}

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-darkgray text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">🚚 Livrare gratuită peste 200 Lei</span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline">↩️ Retur gratuit 30 zile</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/informatii-livrare" className="hover:text-yellow transition-colors hidden sm:inline">
              Livrare
            </Link>
            <Link href="/intrebari-frecvente" className="hover:text-yellow transition-colors hidden sm:inline">
              Ajutor
            </Link>
            <Link href="/contact" className="hover:text-yellow transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl lg:text-2xl font-bold">
              <span className="text-coral">Jucării</span>
              <span className="text-darkgray">Shop</span>
            </span>
          </Link>

          {/* Mega Menu */}
          <MegaMenu categories={categories} />

          {/* Search Bar */}
          <SearchBar />

          {/* Right actions */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Account */}
            <Link
              href="/cont"
              className="flex items-center gap-1.5 text-darkgray hover:text-coral transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium hidden lg:block">Cont</span>
            </Link>

            {/* Wishlist */}
            <WishlistIcon />

            {/* Cart */}
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
