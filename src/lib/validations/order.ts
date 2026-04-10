import { z } from "zod/v4";

export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, "Prenumele este obligatoriu").max(100, "Prenumele nu poate depăși 100 caractere"),
  lastName: z.string().min(2, "Numele este obligatoriu").max(100, "Numele nu poate depăși 100 caractere"),
  phone: z.string().min(10, "Număr de telefon invalid").max(20, "Număr de telefon prea lung"),
  email: z.email("Email invalid"),
  street: z.string().min(3, "Adresa este obligatorie").max(300, "Adresa nu poate depăși 300 caractere"),
  city: z.string().min(2, "Orașul este obligatoriu").max(100, "Orașul nu poate depăși 100 caractere"),
  county: z.string().min(2, "Județul este obligatoriu").max(100, "Județul nu poate depăși 100 caractere"),
  postalCode: z.string().min(4, "Codul poștal este obligatoriu").max(10, "Cod poștal invalid"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1).max(50),
  quantity: z.number().int().positive().max(100, "Cantitatea maximă per produs este 100"),
});

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Coșul este gol").max(50, "Prea multe produse în coș"),
  shippingAddress: shippingAddressSchema,
  notes: z.string().max(1000, "Nota nu poate depăși 1000 caractere").optional(),
  paymentMethod: z.enum(["COD", "STRIPE"]).default("COD"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
