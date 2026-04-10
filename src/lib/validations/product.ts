import { z } from "zod/v4";

export const specificationSchema = z.object({
  key: z.string().min(1, "Cheia este obligatorie"),
  value: z.string().min(1, "Valoarea este obligatorie"),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalid"),
  description: z.string().min(10, "Descrierea trebuie să aibă cel puțin 10 caractere"),
  shortDescription: z.string().optional(),
  price: z.number().positive("Prețul trebuie să fie pozitiv"),
  oldPrice: z.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0, "Stocul nu poate fi negativ"),
  featured: z.boolean().optional(),
  recommendedAge: z.string().optional().nullable(),
  specifications: z.array(specificationSchema).optional(),
  subcategoryId: z.string().min(1, "Subcategoria este obligatorie"),
  recommendationIds: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
