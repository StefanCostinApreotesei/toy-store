import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const [products, categories, subcategories] = await Promise.all([
    prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    }),
    prisma.subcategory.findMany({
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/categorii`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/categorii/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const subcategoryPages: MetadataRoute.Sitemap = subcategories.map((sub) => ({
    url: `${siteUrl}/categorii/${sub.category.slug}/${sub.slug}`,
    lastModified: sub.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/produs/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages];
}
