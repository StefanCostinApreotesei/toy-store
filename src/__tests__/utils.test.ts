import { describe, it, expect } from "vitest";
import {
  cn,
  formatPrice,
  formatPriceSimple,
  generateSlug,
  calculateDiscount,
  generateOrderNumber,
} from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for no classes", () => {
    expect(cn()).toBe("");
  });
});

describe("formatPrice", () => {
  it("formats a simple price", () => {
    expect(formatPrice(49.99)).toEqual({ integer: "49", decimal: "99" });
  });

  it("adds thousands separator", () => {
    expect(formatPrice(1234.5)).toEqual({ integer: "1.234", decimal: "50" });
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toEqual({ integer: "0", decimal: "00" });
  });
});

describe("formatPriceSimple", () => {
  it("formats with Romanian decimal separator", () => {
    expect(formatPriceSimple(99.5)).toBe("99,50 Lei");
  });

  it("formats whole number", () => {
    expect(formatPriceSimple(100)).toBe("100,00 Lei");
  });
});

describe("generateSlug", () => {
  it("converts to lowercase slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("handles Romanian diacritics", () => {
    expect(generateSlug("Jucării educaționale")).toBe("jucarii-educationale");
  });

  it("removes special characters", () => {
    expect(generateSlug("LEGO® Set #123")).toBe("lego-set-123");
  });

  it("collapses multiple dashes", () => {
    expect(generateSlug("a   b---c")).toBe("a-b-c");
  });

  it("trims leading/trailing dashes", () => {
    expect(generateSlug(" -hello- ")).toBe("hello");
  });
});

describe("calculateDiscount", () => {
  it("calculates correct percentage", () => {
    expect(calculateDiscount(75, 100)).toBe(25);
  });

  it("returns 0 when oldPrice <= price", () => {
    expect(calculateDiscount(100, 100)).toBe(0);
    expect(calculateDiscount(100, 50)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    expect(calculateDiscount(33, 100)).toBe(67);
  });
});

describe("generateOrderNumber", () => {
  it("starts with JS- prefix", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^JS-/);
  });

  it("contains date part", () => {
    const orderNumber = generateOrderNumber();
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    expect(orderNumber).toContain(today);
  });

  it("generates unique numbers", () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    expect(a).not.toBe(b);
  });
});
