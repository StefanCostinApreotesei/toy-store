import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import HeroBanner from "@/components/public/HeroBanner";
import CategoryCard from "@/components/public/CategoryCard";
import ProductCarousel from "@/components/public/ProductCarousel";
import RecentlyViewed from "@/components/public/RecentlyViewed";
import NewsletterSignup from "@/components/public/NewsletterSignup";

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  "jucarii-copii": { icon: "🧒", color: "#FF6F61" },
  "jucarii-animale": { icon: "🐾", color: "#6FBF8A" },
};

const SUBCATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  educationale: { icon: "📚", color: "#FF6F61" },
  lego: { icon: "🧱", color: "#FFDA44" },
  caini: { icon: "🐕", color: "#6FBF8A" },
  pisici: { icon: "🐱", color: "#FF6F61" },
  hamsteri: { icon: "🐹", color: "#FFDA44" },
};

const getHomeData = unstable_cache(async () => {
  const [categories, featuredProducts, bestSellers, newArrivals, discountedProducts] =
    await Promise.all([
      prisma.category.findMany({
        include: {
          subcategories: {
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { featured: true, stock: { gt: 0 } },
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          _count: { select: { reviews: true } },
        },
        take: 10,
      }),
      // Best sellers — products with most orders
      prisma.product.findMany({
        where: { stock: { gt: 0 } },
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          _count: { select: { reviews: true, orderItems: true } },
        },
        orderBy: { orderItems: { _count: "desc" } },
        take: 10,
      }),
      // New arrivals — most recently created
      prisma.product.findMany({
        where: { stock: { gt: 0 } },
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      // Discounted products — products with oldPrice set
      prisma.product.findMany({
        where: { stock: { gt: 0 }, oldPrice: { not: null } },
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          _count: { select: { reviews: true } },
        },
        take: 10,
      }),
    ]);

  return { categories, featuredProducts, bestSellers, newArrivals, discountedProducts };
}, ["home-data"], { revalidate: 300 });

export default async function HomePage() {
  const { categories, featuredProducts, bestSellers, newArrivals, discountedProducts } =
    await getHomeData();

  return (
    <div>
      <HeroBanner />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-lg sm:text-2xl font-bold text-darkgray mb-4 sm:mb-6">
          Categorii populare
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) =>
            cat.subcategories.map((sub) => {
              const iconData = SUBCATEGORY_ICONS[sub.slug] || {
                icon: "🎁",
                color: "#FF6F61",
              };
              return (
                <CategoryCard
                  key={sub.id}
                  category={{
                    name: sub.name,
                    slug: `${cat.slug}/${sub.slug}`,
                    description: sub.description,
                  }}
                  icon={iconData.icon}
                  color={iconData.color}
                />
              );
            })
          )}
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-lightgray py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-darkgray">
                Cele mai vândute
              </h2>
              <Link
                href="/categorii"
                className="text-sm text-coral font-medium hover:text-coral-dark transition-colors"
              >
                Vezi toate →
              </Link>
            </div>
            <ProductCarousel products={bestSellers} />
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-darkgray">
              Noutăți
            </h2>
            <Link
              href="/categorii"
              className="text-sm text-coral font-medium hover:text-coral-dark transition-colors"
            >
              Vezi toate →
            </Link>
          </div>
          <ProductCarousel products={newArrivals} />
        </section>
      )}

      {/* Discounted Products */}
      {discountedProducts.length > 0 && (
        <section className="bg-gradient-to-r from-coral/5 to-yellow/5 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="bg-coral text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                  REDUCERI
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-darkgray">
                  Oferte speciale
                </h2>
              </div>
              <Link
                href="/categorii"
                className="text-sm text-coral font-medium hover:text-coral-dark transition-colors"
              >
                Vezi toate →
              </Link>
            </div>
            <ProductCarousel products={discountedProducts} />
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-darkgray">
              Produse recomandate
            </h2>
            <Link
              href="/categorii"
              className="text-sm text-coral font-medium hover:text-coral-dark transition-colors"
            >
              Vezi toate →
            </Link>
          </div>
          <ProductCarousel products={featuredProducts} />
        </section>
      )}

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Trust banners */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <span className="text-3xl">🚚</span>
            <div>
              <p className="font-bold text-darkgray">Livrare gratuită</p>
              <p className="text-sm text-darkgray-light">
                Pentru comenzi peste 200 Lei
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <span className="text-3xl">🔒</span>
            <div>
              <p className="font-bold text-darkgray">Plată securizată</p>
              <p className="text-sm text-darkgray-light">
                Tranzacții 100% sigure
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
            <span className="text-3xl">↩️</span>
            <div>
              <p className="font-bold text-darkgray">Retur gratuit</p>
              <p className="text-sm text-darkgray-light">
                30 de zile garanție de returnare
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
