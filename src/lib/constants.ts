export const SITE_NAME = "JucăriiShop";
export const SITE_DESCRIPTION =
  "Magazin online cu jucării pentru copii și animale de companie";

export const COLORS = {
  coral: "#FF6F61",
  green: "#6FBF8A",
  yellow: "#FFDA44",
  lightgray: "#F5F5F5",
  darkgray: "#5D5C61",
} as const;

export const ORDER_STATUSES = {
  PENDING: "În așteptare",
  CONFIRMED: "Confirmată",
  SHIPPED: "Expediată",
  DELIVERED: "Livrată",
  CANCELLED: "Anulată",
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  CLIENT: "CLIENT",
} as const;

export const PRODUCTS_PER_PAGE = 12;

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
