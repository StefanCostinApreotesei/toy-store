import { z } from "zod/v4";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(100, "Numele nu poate depăși 100 caractere"),
  slug: z.string().max(100, "Slug-ul nu poate depăși 100 caractere").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalid"),
  description: z.string().max(1000, "Descrierea nu poate depăși 1000 caractere").optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
});

export const createSubcategorySchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(100, "Numele nu poate depăși 100 caractere"),
  slug: z.string().max(100, "Slug-ul nu poate depăși 100 caractere").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalid"),
  description: z.string().max(1000, "Descrierea nu poate depăși 1000 caractere").optional(),
  categoryId: z.string().min(1, "Categoria este obligatorie").max(50),
  displayOrder: z.number().int().min(0).max(9999).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
