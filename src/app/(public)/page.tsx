import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/public/HeroBanner";
import CategoryCard from "@/components/public/CategoryCard";
import ProductGrid from "@/components/public/ProductGrid";

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

async function getHomeData() {
  const [categories, featuredProducts] = await Promise.all([
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
      },
      take: 8,
    }),
  ]);

  return { categories, featuredProducts };
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomeData();

  return (
    <div>
      <HeroBanner />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-darkgray mb-6">
          Categorii populare
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Featured Products */}
      <section className="bg-lightgray py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-darkgray mb-6">
            Produse recomandate
          </h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Trust banners */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
