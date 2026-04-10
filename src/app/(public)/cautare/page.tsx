import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductGrid from "@/components/public/ProductGrid";
import ProductFilters from "@/components/public/ProductFilters";
import Pagination from "@/components/public/Pagination";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma";

interface Props {
  searchParams: Promise<{
    q?: string;
    pagina?: string;
    pret_min?: string;
    pret_max?: string;
    in_stoc?: string;
    sortare?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: sp.q ? `Căutare: ${sp.q}` : "Căutare",
  };
}

function buildOrderBy(sort: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "name-asc":
      return { name: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const query = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.pagina || "1"));
  const priceMin = sp.pret_min ? parseFloat(sp.pret_min) : undefined;
  const priceMax = sp.pret_max ? parseFloat(sp.pret_max) : undefined;
  const inStock = sp.in_stoc === "1";
  const sort = sp.sortare || "newest";

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

  const where: Prisma.ProductWhereInput = {
    OR: [
      { name: { contains: query } },
      { shortDescription: { contains: query } },
      { sku: { contains: query } },
    ],
    ...(priceMin !== undefined || priceMax !== undefined
      ? {
          price: {
            ...(priceMin !== undefined && { gte: priceMin }),
            ...(priceMax !== undefined && { lte: priceMax }),
          },
        }
      : {}),
    ...(inStock && { stock: { gt: 0 } }),
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
      },
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // Preserve filter params in pagination links
  const filterParams: Record<string, string> = { q: query };
  if (sp.pret_min) filterParams.pret_min = sp.pret_min;
  if (sp.pret_max) filterParams.pret_max = sp.pret_max;
  if (sp.in_stoc) filterParams.in_stoc = sp.in_stoc;
  if (sp.sortare) filterParams.sortare = sp.sortare;

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

      <ProductFilters />

      <ProductGrid products={products} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/cautare"
        searchParams={filterParams}
      />
    </div>
  );
}
