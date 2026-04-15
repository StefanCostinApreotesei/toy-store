import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import ImageGallery from "@/components/public/ImageGallery";
import PriceDisplay from "@/components/public/PriceDisplay";
import ProductSpecs from "@/components/public/ProductSpecs";
import RecommendedProducts from "@/components/public/RecommendedProducts";
import AddToCartButton from "@/components/public/AddToCartButton";
import WishlistButton from "@/components/public/WishlistButton";
import ProductReviews from "@/components/public/ProductReviews";
import ProductTabs from "@/components/public/ProductTabs";
import ShareButtons from "@/components/public/ShareButtons";
import DeliveryEstimate from "@/components/public/DeliveryEstimate";
import TrackRecentlyViewed from "@/components/public/TrackRecentlyViewed";
import type { Specification } from "@/types/product";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
  });
  if (!product) return { title: "Produs negăsit" };

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const imageUrl = product.images[0]?.url;

  return {
    title: product.name,
    description: product.shortDescription || product.name,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.name,
      type: "website",
      url: `${siteUrl}/produs/${product.slug}`,
      ...(imageUrl && { images: [{ url: imageUrl, alt: product.name }] }),
    },
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
      _count: { select: { reviews: true } },
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

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description.replace(/<[^>]*>/g, "").slice(0, 300),
    image: product.images.map((img) => img.url),
    sku: product.sku || undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteUrl}/produs/${product.slug}`,
    },
  };

  const recentProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    oldPrice: product.oldPrice,
    stock: product.stock,
    images: product.images.slice(0, 1).map((img) => ({
      url: img.url,
      alt: img.alt,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <TrackRecentlyViewed product={recentProduct} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <ImageGallery images={product.images} productName={product.name} />

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

          <div className="flex gap-3">
            <div className="flex-1">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                price={product.price}
                stock={product.stock}
                slug={product.slug}
                imageUrl={mainImage?.url}
              />
            </div>
            <WishlistButton productId={product.id} size="md" />
          </div>

          {product.shortDescription && (
            <p className="mt-6 text-darkgray-light">{product.shortDescription}</p>
          )}

          {/* Share */}
          <ShareButtons title={product.name} />

          {/* Delivery estimate */}
          <div className="mt-4">
            <DeliveryEstimate stock={product.stock} price={product.price} />
          </div>
        </div>
      </div>

      {/* Tabs: Descriere / Specificații / Recenzii */}
      <ProductTabs
        tabs={[
          { id: "descriere", label: "Descriere" },
          { id: "specificatii", label: "Specificații", count: specifications.length },
          { id: "recenzii", label: "Recenzii", count: product._count.reviews },
        ]}
      >
        {/* Tab: Descriere */}
        <div>
          <div
            className="prose prose-sm max-w-none text-darkgray-light"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Tab: Specificații */}
        <div>
          {specifications.length > 0 ? (
            <ProductSpecs specifications={specifications} />
          ) : (
            <p className="text-sm text-darkgray-light">
              Nu sunt specificații disponibile pentru acest produs.
            </p>
          )}
        </div>

        {/* Tab: Recenzii */}
        <div>
          <ProductReviews productId={product.id} />
        </div>
      </ProductTabs>

      {/* Recommendations */}
      <RecommendedProducts products={product.recommendations} />
    </div>
  );
}
