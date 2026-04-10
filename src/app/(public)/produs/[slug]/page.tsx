import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import PriceDisplay from "@/components/public/PriceDisplay";
import ProductSpecs from "@/components/public/ProductSpecs";
import RecommendedProducts from "@/components/public/RecommendedProducts";
import AddToCartButton from "@/components/public/AddToCartButton";
import type { Specification } from "@/types/product";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  if (!product) return { title: "Produs negăsit" };
  return {
    title: product.name,
    description: product.shortDescription || product.name,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      subcategory: {
        include: { category: true },
      },
      recommendations: {
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
        },
        take: 4,
      },
    },
  });

  if (!product) notFound();

  let specifications: Specification[] = [];
  try {
    specifications = product.specifications
      ? JSON.parse(product.specifications)
      : [];
  } catch {
    specifications = [];
  }

  const mainImage = product.images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumbs
        items={[
          { label: "Categorii", href: "/categorii" },
          {
            label: product.subcategory.category.name,
            href: `/categorii/${product.subcategory.category.slug}`,
          },
          {
            label: product.subcategory.name,
            href: `/categorii/${product.subcategory.category.slug}/${product.subcategory.slug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-lightgray rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
            <div className="w-full h-full bg-gradient-to-br from-coral/10 to-yellow/10 flex items-center justify-center">
              <span className="text-8xl">🧸</span>
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={img.id}
                  className={`aspect-square rounded-lg bg-lightgray border-2 flex items-center justify-center cursor-pointer ${
                    index === 0
                      ? "border-coral"
                      : "border-gray-100 hover:border-coral/50"
                  } transition-colors`}
                >
                  <span className="text-2xl">🧸</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2">
            <span className="text-sm text-coral font-medium">
              {product.subcategory.category.name} → {product.subcategory.name}
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-darkgray mb-4">
            {product.name}
          </h1>

          {product.sku && (
            <p className="text-xs text-darkgray-light mb-4">
              SKU: {product.sku}
            </p>
          )}

          <div className="bg-lightgray rounded-xl p-6 mb-6">
            <PriceDisplay
              price={product.price}
              oldPrice={product.oldPrice}
              size="lg"
            />
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-4">
            {product.stock > 0 ? (
              <>
                <span className="w-2.5 h-2.5 bg-green rounded-full" />
                <span className="text-sm font-medium text-green">
                  În stoc ({product.stock} disponibile)
                </span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-red-500">
                  Stoc epuizat
                </span>
              </>
            )}
          </div>

          {product.recommendedAge && (
            <div className="flex items-center gap-2 mb-4 text-sm text-darkgray-light">
              <span>👶</span>
              <span>Vârstă recomandată: {product.recommendedAge}</span>
            </div>
          )}

          <AddToCartButton
            productId={product.id}
            productName={product.name}
            price={product.price}
            stock={product.stock}
            slug={product.slug}
            imageUrl={mainImage?.url}
          />

          {product.shortDescription && (
            <p className="mt-6 text-darkgray-light">{product.shortDescription}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-darkgray mb-4">Descriere</h2>
        <div
          className="prose prose-sm max-w-none text-darkgray-light"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      {/* Specifications */}
      {specifications.length > 0 && (
        <div className="mt-8">
          <ProductSpecs specifications={specifications} />
        </div>
      )}

      {/* Recommendations */}
      <RecommendedProducts products={product.recommendations} />
    </div>
  );
}
