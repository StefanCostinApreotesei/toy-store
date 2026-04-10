import { formatPrice, calculateDiscount } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  oldPrice?: number | null;
  size?: "sm" | "md" | "lg";
}

export default function PriceDisplay({
  price,
  oldPrice,
  size = "md",
}: PriceDisplayProps) {
  const { integer, decimal } = formatPrice(price);
  const discount = oldPrice ? calculateDiscount(price, oldPrice) : 0;

  const sizeClasses = {
    sm: { price: "text-xl", decimal: "text-xs", currency: "text-[10px]", old: "text-xs" },
    md: { price: "text-2xl", decimal: "text-sm", currency: "text-xs", old: "text-sm" },
    lg: { price: "text-4xl", decimal: "text-lg", currency: "text-sm", old: "text-base" },
  };

  const s = sizeClasses[size];

  return (
    <div>
      {/* Old price + discount badge */}
      {oldPrice && discount > 0 && (
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`${s.old} line-through text-darkgray/40`}>
            {oldPrice.toFixed(2).replace(".", ",")} Lei
          </span>
          <span className="bg-yellow text-darkgray text-xs font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        </div>
      )}

      {/* Current price - Lidl style */}
      <div className="flex items-baseline gap-0.5">
        <span className={`${s.price} font-extrabold text-darkgray leading-none`}>
          {integer}
        </span>
        <span className={`${s.decimal} font-bold text-darkgray align-super leading-none`}>
          ,{decimal}
        </span>
        <span className={`${s.currency} text-darkgray/60 ml-1 font-medium`}>
          Lei
        </span>
      </div>
    </div>
  );
}
