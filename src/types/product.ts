import type { Product, ProductImage, Subcategory, Category } from "@/generated/prisma";

export type ProductWithImages = Product & {
  images: ProductImage[];
};

export type ProductWithDetails = Product & {
  images: ProductImage[];
  subcategory: Subcategory & {
    category: Category;
  };
  recommendations: ProductWithImages[];
};

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: { url: string; alt: string | null }[];
  subcategory: {
    name: string;
    slug: string;
    category: {
      name: string;
      slug: string;
    };
  };
};

export type Specification = {
  key: string;
  value: string;
};
