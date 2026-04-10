import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: { url: string; alt: string | null }[];
}

interface RecommendedProductsProps {
  products: Product[];
}

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-darkgray mb-6">
        Produse similare
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
