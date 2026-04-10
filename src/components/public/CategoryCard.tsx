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
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col items-center text-center"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-darkgray group-hover:text-coral transition-colors mb-2">
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
