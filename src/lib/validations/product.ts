import { z } from "zod/v4";

export const specificationSchema = z.object({
  key: z.string().min(1, "Cheia este obligatorie").max(100, "Cheia nu poate depăși 100 caractere"),
  value: z.string().min(1, "Valoarea este obligatorie").max(500, "Valoarea nu poate depăși 500 caractere"),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(255, "Numele nu poate depăși 255 caractere"),
  slug: z
    .string()
    .max(255, "Slug-ul nu poate depăși 255 caractere")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalid"),
  description: z.string().min(10, "Descrierea trebuie să aibă cel puțin 10 caractere").max(10000, "Descrierea nu poate depăși 10.000 caractere"),
  shortDescription: z.string().max(500, "Descrierea scurtă nu poate depăși 500 caractere").optional(),
  price: z.number().positive("Prețul trebuie să fie pozitiv").max(999999.99, "Prețul este prea mare"),
  oldPrice: z.number().positive().max(999999.99).optional().nullable(),
  sku: z.string().max(50, "SKU-ul nu poate depăși 50 caractere").optional().nullable(),
  stock: z.number().int().min(0, "Stocul nu poate fi negativ").max(999999, "Stocul este prea mare"),
  featured: z.boolean().optional(),
  recommendedAge: z.string().max(50, "Vârsta recomandată nu poate depăși 50 caractere").optional().nullable(),
  specifications: z.array(specificationSchema).max(50, "Prea multe specificații").optional(),
  subcategoryId: z.string().min(1, "Subcategoria este obligatorie").max(50),
  recommendationIds: z.array(z.string().max(50)).max(20, "Prea multe recomandări").optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
