import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ProductGrid from "@/components/public/ProductGrid";
import Pagination from "@/components/public/Pagination";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
  searchParams: Promise<{ pagina?: string }>;
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

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { categorySlug, subcategorySlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.pagina || "1"));

  const subcategory = await prisma.subcategory.findUnique({
    where: { slug: subcategorySlug },
    include: { category: true },
  });

  if (!subcategory || subcategory.category.slug !== categorySlug) {
    notFound();
  }

  const where = { subcategoryId: subcategory.id };

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

      <ProductGrid products={products} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl={`/categorii/${categorySlug}/${subcategorySlug}`}
      />
    </div>
  );
}
