import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductGrid from "@/components/public/ProductGrid";
import ProductFilters from "@/components/public/ProductFilters";
import Pagination from "@/components/public/Pagination";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma";

interface Props {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
  searchParams: Promise<{
    pagina?: string;
    pret_min?: string;
    pret_max?: string;
    in_stoc?: string;
    sortare?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategorySlug } = await params;
  const subcategory = await prisma.subcategory.findUnique({
    where: { slug: subcategorySlug },
    include: { category: true },
  });
  if (!subcategory) return { title: "Subcategorie negăsită" };
  return {
    title: `${subcategory.name} - ${subcategory.category.name}`,
    description: subcategory.description || `Produse din ${subcategory.name}`,
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

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { categorySlug, subcategorySlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.pagina || "1"));
  const priceMin = sp.pret_min ? parseFloat(sp.pret_min) : undefined;
  const priceMax = sp.pret_max ? parseFloat(sp.pret_max) : undefined;
  const inStock = sp.in_stoc === "1";
  const sort = sp.sortare || "newest";

  const subcategory = await prisma.subcategory.findUnique({
    where: { slug: subcategorySlug },
    include: { category: true },
  });

  if (!subcategory || subcategory.category.slug !== categorySlug) {
    notFound();
  }

  const where: Prisma.ProductWhereInput = {
    subcategoryId: subcategory.id,
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
          {
            label: subcategory.category.name,
            href: `/categorii/${subcategory.category.slug}`,
          },
          { label: subcategory.name },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-darkgray">{subcategory.name}</h1>
        <span className="text-sm text-darkgray-light">
          {totalCount} {totalCount === 1 ? "produs" : "produse"}
        </span>
      </div>

      {subcategory.description && (
        <p className="text-darkgray-light mb-6">{subcategory.description}</p>
      )}

      <ProductFilters />

      <ProductGrid products={products} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl={`/categorii/${categorySlug}/${subcategorySlug}`}
        searchParams={filterParams}
      />
    </div>
  );
}
