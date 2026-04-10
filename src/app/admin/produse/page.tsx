import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const search = sp.search || "";
  const limit = 20;

  const where = search
    ? { OR: [{ name: { contains: search } }, { sku: { contains: search } }] }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        subcategory: { include: { category: true } },
        images: { take: 1, orderBy: { displayOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-darkgray">Produse</h1>
        <Link
          href="/admin/produse/nou"
          className="bg-coral text-white font-bold px-4 py-2 rounded-lg hover:bg-coral-dark transition-colors"
        >
          + Adaugă produs
        </Link>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Caută după nume sau SKU..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
        />
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-lightgray">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-darkgray">Produs</th>
                <th className="text-left px-4 py-3 font-medium text-darkgray">Categorie</th>
                <th className="text-right px-4 py-3 font-medium text-darkgray">Preț</th>
                <th className="text-center px-4 py-3 font-medium text-darkgray">Stoc</th>
                <th className="text-center px-4 py-3 font-medium text-darkgray">Featured</th>
                <th className="text-right px-4 py-3 font-medium text-darkgray">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-lightgray/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-lightgray rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">🧸</span>
                      </div>
                      <div>
                        <p className="font-medium text-darkgray line-clamp-1">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-darkgray-light">SKU: {product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-darkgray-light">
                    {product.subcategory.category.name} → {product.subcategory.name}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-darkgray">
                    {product.price.toFixed(2).replace(".", ",")} Lei
                    {product.oldPrice && (
                      <span className="block text-xs line-through text-darkgray-light">
                        {product.oldPrice.toFixed(2).replace(".", ",")} Lei
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : product.stock <= 5
                          ? "bg-yellow/20 text-darkgray"
                          : "bg-green/20 text-green-dark"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.featured ? "⭐" : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/produse/${product.id}/editare`}
                      className="text-coral hover:text-coral-dark font-medium text-xs"
                    >
                      Editează
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <p className="text-center py-8 text-darkgray-light">
            {search ? "Niciun produs găsit" : "Niciun produs adăugat încă"}
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/produse?page=${p}${search ? `&search=${search}` : ""}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm ${
                p === page
                  ? "bg-coral text-white font-bold"
                  : "bg-white border border-gray-200 text-darkgray hover:bg-coral hover:text-white"
              } transition-colors`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}

      <p className="text-sm text-darkgray-light mt-4 text-center">
        {total} {total === 1 ? "produs" : "produse"} în total
      </p>
    </div>
  );
}
