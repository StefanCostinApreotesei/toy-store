export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): { integer: string; decimal: string } {
  const formatted = price.toFixed(2);
  const [integer, decimal] = formatted.split(".");
  return {
    integer: integer.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    decimal,
  };
}

export function formatPriceSimple(price: number): string {
  return `${price.toFixed(2).replace(".", ",")} Lei`;
}

export function generateSlug(text: string): string {
  const diacriticsMap: Record<string, string> = {
    ă: "a", â: "a", î: "i", ș: "s", ț: "t",
    Ă: "a", Â: "a", Î: "i", Ș: "s", Ț: "t",
  };

  return text
    .split("")
    .map((char) => diacriticsMap[char] || char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateDiscount(price: number, oldPrice: number): number {
  if (oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `JS-${datePart}-${randomPart}`;
}
