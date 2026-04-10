import Image from "next/image";
import Link from "next/link";
import PriceDisplay from "./PriceDisplay";
import PromoBadge from "./PromoBadge";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    images: { url: string; alt: string | null }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0];

  return (
    <Link
      href={`/produs/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-lightgray overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-300 text-4xl">📷</span>
          </div>
        )}

        {/* Wishlist */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton productId={product.id} />
        </div>

        {product.oldPrice && (
          <PromoBadge price={product.price} oldPrice={product.oldPrice} />
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-darkgray text-sm font-bold px-3 py-1 rounded">
              Stoc epuizat
            </span>
          </div>
        )}

        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-coral text-white text-xs font-medium px-2 py-0.5 rounded">
            Ultimele {product.stock} bucăți
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-darkgray line-clamp-2 group-hover:text-coral transition-colors mb-2 flex-1">
          {product.name}
        </h3>

        {product.stock > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="w-1.5 h-1.5 bg-green rounded-full" />
            <span className="text-xs text-green font-medium">În stoc</span>
          </div>
        )}

        <PriceDisplay
          price={product.price}
          oldPrice={product.oldPrice}
          size="sm"
        />
      </div>
    </Link>
  );
}
