import { describe, it, expect } from "vitest";
import {
  shippingAddressSchema,
  cartItemSchema,
  createOrderSchema,
} from "@/lib/validations/order";

const validAddress = {
  firstName: "Ion",
  lastName: "Popescu",
  phone: "0712345678",
  email: "ion@example.com",
  street: "Str. Florilor 10",
  city: "București",
  county: "Ilfov",
  postalCode: "012345",
};

describe("shippingAddressSchema", () => {
  it("accepts valid address", () => {
    const result = shippingAddressSchema.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it("rejects short first name", () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, firstName: "I" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("rejects short phone", () => {
    const result = shippingAddressSchema.safeParse({ ...validAddress, phone: "123" });
    expect(result.success).toBe(false);
  });
});

describe("cartItemSchema", () => {
  it("accepts valid item", () => {
    const result = cartItemSchema.safeParse({ productId: "abc123", quantity: 2 });
    expect(result.success).toBe(true);
  });

  it("rejects zero quantity", () => {
    const result = cartItemSchema.safeParse({ productId: "abc123", quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative quantity", () => {
    const result = cartItemSchema.safeParse({ productId: "abc123", quantity: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects quantity over 100", () => {
    const result = cartItemSchema.safeParse({ productId: "abc123", quantity: 101 });
    expect(result.success).toBe(false);
  });
});

describe("createOrderSchema", () => {
  const validOrder = {
    items: [{ productId: "prod1", quantity: 1 }],
    shippingAddress: validAddress,
    paymentMethod: "COD" as const,
  };

  it("accepts valid order", () => {
    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("defaults paymentMethod to COD", () => {
    const { paymentMethod, ...orderWithoutPayment } = validOrder;
    void paymentMethod;
    const result = createOrderSchema.safeParse(orderWithoutPayment);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paymentMethod).toBe("COD");
    }
  });

  it("accepts STRIPE payment", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, paymentMethod: "STRIPE" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid payment method", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, paymentMethod: "BITCOIN" });
    expect(result.success).toBe(false);
  });

  it("rejects empty cart", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it("accepts couponCode", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, couponCode: "SAVE10" });
    expect(result.success).toBe(true);
  });

  it("accepts optional notes", () => {
    const result = createOrderSchema.safeParse({ ...validOrder, notes: "Livrare dimineață" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.notes).toBe("Livrare dimineață");
    }
  });
});
