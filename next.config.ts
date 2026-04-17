import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const siteOrigin = process.env.NEXTAUTH_URL || "http://localhost:3000";

const imageHostnames = (process.env.ALLOWED_IMAGE_HOSTS || "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...imageHostnames.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
      { protocol: "https" as const, hostname: "res.cloudinary.com" },
      { protocol: "https" as const, hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    const scriptSrc = isProd
      ? "script-src 'self'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self \"https://js.stripe.com\")",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc + " https://js.stripe.com https://checkout.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              `img-src 'self' data: blob: ${new URL(siteOrigin).origin} https://res.cloudinary.com https://lh3.googleusercontent.com`,
              "connect-src 'self' https://api.stripe.com https://checkout.stripe.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.stripe.com",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
