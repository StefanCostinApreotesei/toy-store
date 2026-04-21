import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "./SearchBar";
import MegaMenu from "./MegaMenu";
import CartIcon from "./CartIcon";
import WishlistIcon from "./WishlistIcon";
import AccountLink from "./AccountLink";

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
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3">
        {/* Row 1: Logo + Menu + Actions (+ search on desktop) */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold">
              <span className="text-coral">Jucării</span>
              <span className="text-darkgray">Shop</span>
            </span>
          </Link>

          {/* Mega Menu */}
          <MegaMenu categories={categories} />

          {/* Search Bar — hidden on mobile, shown on sm+ */}
          <div className="hidden sm:block flex-1">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0 ml-auto sm:ml-0">
            {/* Account */}
            <AccountLink />

            {/* Wishlist */}
            <WishlistIcon />

            {/* Cart */}
            <CartIcon />
          </div>
        </div>

        {/* Row 2: Search bar on mobile only */}
        <div className="mt-2 sm:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
