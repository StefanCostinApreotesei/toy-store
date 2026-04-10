import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pagina", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex justify-center items-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-darkgray hover:bg-coral hover:text-white hover:border-coral transition-colors"
        >
          ← Anterior
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-darkgray-light">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              "w-10 h-10 flex items-center justify-center text-sm rounded-lg border transition-colors",
              page === currentPage
                ? "bg-coral text-white border-coral font-bold"
                : "border-gray-200 text-darkgray hover:bg-coral hover:text-white hover:border-coral"
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-darkgray hover:bg-coral hover:text-white hover:border-coral transition-colors"
        >
          Următor →
        </Link>
      )}
    </nav>
  );
}
