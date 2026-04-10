import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductGrid from "@/components/public/ProductGrid";
import ProductFilters from "@/components/public/ProductFilters";
import Pagination from "@/components/public/Pagination";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma";
import Link from "next/link";

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
    pagina?: string;
    pret_min?: string;
    pret_max?: string;
    in_stoc?: string;
    sortare?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return { title: "Categorie negăsită" };
  return {
    title: category.name,
    description: category.description || `Produse din categoria ${category.name}`,
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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.pagina || "1"));
  const priceMin = sp.pret_min ? parseFloat(sp.pret_min) : undefined;
  const priceMax = sp.pret_max ? parseFloat(sp.pret_max) : undefined;
  const inStock = sp.in_stoc === "1";
  const sort = sp.sortare || "newest";

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      subcategories: { orderBy: { displayOrder: "asc" } },
    },
  });

  if (!category) notFound();

  const subcategoryIds = category.subcategories.map((s) => s.id);

  const where: Prisma.ProductWhereInput = {
    subcategoryId: { in: subcategoryIds },
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
  const filterParams: Record<string, string> = {};
  if (sp.pret_min) filterParams.pret_min = sp.pret_min;
  if (sp.pret_max) filterParams.pret_max = sp.pret_max;
  if (sp.in_stoc) filterParams.in_stoc = sp.in_stoc;
  if (sp.sortare) filterParams.sortare = sp.sortare;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumbs
        items={[
          { label: "Categorii", href: "/categorii" },
          { label: category.name },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
            <h3 className="font-bold text-darkgray mb-3">Subcategorii</h3>
            <ul className="space-y-2">
              {category.subcategories.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/categorii/${category.slug}/${sub.slug}`}
                    className="text-sm text-darkgray hover:text-coral transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-coral/40 rounded-full" />
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-darkgray">{category.name}</h1>
            <span className="text-sm text-darkgray-light">
              {totalCount} {totalCount === 1 ? "produs" : "produse"}
            </span>
          </div>

          <ProductFilters />

          <ProductGrid products={products} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/categorii/${category.slug}`}
            searchParams={filterParams}
          />
        </div>
      </div>
    </div>
  );
}
