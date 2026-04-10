import { z } from "zod/v4";

export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, "Prenumele este obligatoriu"),
  lastName: z.string().min(2, "Numele este obligatoriu"),
  phone: z.string().min(10, "Număr de telefon invalid"),
  email: z.email("Email invalid"),
  street: z.string().min(3, "Adresa este obligatorie"),
  city: z.string().min(2, "Orașul este obligatoriu"),
  county: z.string().min(2, "Județul este obligatoriu"),
  postalCode: z.string().min(4, "Codul poștal este obligatoriu"),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Coșul este gol"),
  shippingAddress: shippingAddressSchema,
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
