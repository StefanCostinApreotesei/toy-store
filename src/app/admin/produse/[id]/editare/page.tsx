import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, subcategories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { displayOrder: "asc" } } },
    }),
    prisma.subcategory.findMany({
      include: { category: true },
      orderBy: { category: { displayOrder: "asc" } },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-darkgray mb-6">
        Editare: {product.name}
      </h1>
      <ProductForm product={product} subcategories={subcategories} />
    </div>
  );
}
