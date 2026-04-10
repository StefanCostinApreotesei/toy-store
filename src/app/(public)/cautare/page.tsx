import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductGrid from "@/components/public/ProductGrid";
import Pagination from "@/components/public/Pagination";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string; pagina?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: sp.q ? `Căutare: ${sp.q}` : "Căutare",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.pagina || "1"));

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <Breadcrumbs items={[{ label: "Căutare" }]} />
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🔍</span>
          <h1 className="text-2xl font-bold text-darkgray mb-2">
            Caută produse
          </h1>
          <p className="text-darkgray-light">
            Introdu un termen de căutare în bara de sus
          </p>
        </div>
      </div>
    );
  }

  const where = {
    OR: [
      { name: { contains: query } },
      { shortDescription: { contains: query } },
      { sku: { contains: query } },
    ],
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: `Căutare: "${query}"` }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-darkgray">
          Rezultate pentru &quot;{query}&quot;
        </h1>
        <span className="text-sm text-darkgray-light">
          {totalCount} {totalCount === 1 ? "rezultat" : "rezultate"}
        </span>
      </div>

      <ProductGrid products={products} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/cautare"
        searchParams={{ q: query }}
      />
    </div>
  );
}
