import type { Category, Subcategory } from "@/generated/prisma";

export type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

export type CategoryTree = CategoryWithSubcategories[];
