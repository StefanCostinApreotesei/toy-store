import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import CategoryCard from "@/components/public/CategoryCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorii",
  description: "Explorează toate categoriile de jucării - pentru copii și animale de companie",
};

const SUBCATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  educationale: { icon: "📚", color: "#FF6F61" },
  lego: { icon: "🧱", color: "#FFDA44" },
  caini: { icon: "🐕", color: "#6FBF8A" },
  pisici: { icon: "🐱", color: "#FF6F61" },
  hamsteri: { icon: "🐹", color: "#FFDA44" },
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Categorii" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-8">Toate categoriile</h1>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-10">
          <h2 className="text-xl font-bold text-darkgray mb-4 pb-2 border-b-2 border-coral">
            {cat.name}
          </h2>
          {cat.description && (
            <p className="text-darkgray-light mb-4">{cat.description}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cat.subcategories.map((sub) => {
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
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
