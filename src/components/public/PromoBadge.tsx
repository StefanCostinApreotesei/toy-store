import { calculateDiscount } from "@/lib/utils";

interface PromoBadgeProps {
  price: number;
  oldPrice: number;
}

export default function PromoBadge({ price, oldPrice }: PromoBadgeProps) {
  const discount = calculateDiscount(price, oldPrice);
  if (discount <= 0) return null;

  return (
    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-yellow text-darkgray text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded sm:rounded-lg shadow-sm z-[5]">
      -{discount}%
    </div>
  );
}
