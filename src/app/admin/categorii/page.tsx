import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { displayOrder: "asc" },
        include: {
          _count: { select: { products: true } },
        },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-darkgray mb-6">Categorii</h1>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-darkgray">{cat.name}</h2>
                <p className="text-sm text-darkgray-light">slug: /{cat.slug}</p>
              </div>
              <span className="text-xs text-darkgray-light bg-lightgray px-3 py-1 rounded-full">
                Ordine: {cat.displayOrder}
              </span>
            </div>

            {cat.description && (
              <p className="text-sm text-darkgray-light mb-4">{cat.description}</p>
            )}

            <h3 className="text-sm font-bold text-darkgray mb-2">Subcategorii:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {cat.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-lightgray rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-darkgray">{sub.name}</p>
                    <p className="text-xs text-darkgray-light">/{sub.slug}</p>
                  </div>
                  <span className="bg-white text-xs font-bold text-darkgray px-2 py-0.5 rounded">
                    {sub._count.products} produse
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
