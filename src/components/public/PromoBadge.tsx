import { calculateDiscount } from "@/lib/utils";

interface PromoBadgeProps {
  price: number;
  oldPrice: number;
}

export default function PromoBadge({ price, oldPrice }: PromoBadgeProps) {
  const discount = calculateDiscount(price, oldPrice);
  if (discount <= 0) return null;

  return (
    <div className="absolute top-2 right-2 bg-yellow text-darkgray text-xs font-bold px-2 py-1 rounded-lg shadow-sm z-10">
      -{discount}%
    </div>
  );
}
