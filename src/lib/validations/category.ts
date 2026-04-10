import { z } from "zod/v4";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalid"),
  description: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const createSubcategorySchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalid"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Categoria este obligatorie"),
  displayOrder: z.number().int().min(0).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
