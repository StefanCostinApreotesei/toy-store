import Link from "next/link";

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    description: string | null;
    _count?: { products?: number };
  };
  icon: string;
  color: string;
}

export default function CategoryCard({ category, icon, color }: CategoryCardProps) {
  return (
    <Link
      href={`/categorii/${category.slug}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 p-6 flex flex-col items-center text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-3"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-darkgray group-hover:text-coral transition-colors duration-300 mb-2">
        {category.name}
      </h3>
      {category.description && (
        <p className="text-sm text-darkgray-light line-clamp-2">
          {category.description}
        </p>
      )}
    </Link>
  );
}
