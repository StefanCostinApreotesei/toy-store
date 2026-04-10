import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const subcategories = await prisma.subcategory.findMany({
    include: { category: true },
    orderBy: { category: { displayOrder: "asc" } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-darkgray mb-6">Adaugă produs nou</h1>
      <ProductForm subcategories={subcategories} />
    </div>
  );
}
