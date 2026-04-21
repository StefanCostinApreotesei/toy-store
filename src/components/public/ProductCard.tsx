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
    _count?: { reviews: number };
    avgRating?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0];
  const reviewCount = product._count?.reviews || 0;
  const avgRating = product.avgRating || 0;
  const showFreeDelivery = product.price >= 200;

  return (
    <Link
      href={`/produs/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 flex flex-col h-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
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

        {/* Wishlist — top right */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton productId={product.id} />
        </div>

        {/* Promo badge — top left, inside image area */}
        {product.oldPrice && (
          <PromoBadge price={product.price} oldPrice={product.oldPrice} />
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-darkgray text-xs sm:text-sm font-bold px-3 py-1 rounded">
              Stoc epuizat
            </span>
          </div>
        )}

        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-coral text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded">
            Ultimele {product.stock} buc.
          </div>
        )}
      </div>

      {/* Content — flex column with fixed sections */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 border-t border-gray-100">
        {/* Name — fixed 2-line height */}
        <h3 className="text-xs sm:text-sm font-medium text-darkgray line-clamp-2 group-hover:text-coral transition-colors min-h-[2rem] sm:min-h-[2.5rem] mb-1">
          {product.name}
        </h3>

        {/* Rating — fixed height slot */}
        <div className="min-h-[1.25rem] mb-1">
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(avgRating) ? "text-yellow" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] sm:text-xs text-darkgray-light">({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Stock + Delivery — fixed height slot */}
        <div className="min-h-[2rem] mb-2">
          {product.stock > 0 && (
            <div className="flex items-center gap-1 mb-0.5">
              <span className="w-1.5 h-1.5 bg-green rounded-full flex-shrink-0" />
              <span className="text-[10px] sm:text-xs text-green font-medium">În stoc</span>
            </div>
          )}
          {showFreeDelivery && product.stock > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-xs">🚚</span>
              <span className="text-[10px] sm:text-xs text-darkgray-light">Livrare gratuită</span>
            </div>
          )}
        </div>

        {/* Price — pushed to bottom, fixed height for old price line */}
        <div className="mt-auto min-h-[2.75rem]">
          <PriceDisplay
            price={product.price}
            oldPrice={product.oldPrice}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}
