import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createProductSchema } from "@/lib/validations/product";
import sanitizeHtml from "sanitize-html";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const search = searchParams.get("search") || "";
  const subcategoryId = searchParams.get("subcategoryId") || "";

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { sku: { contains: search } },
      ],
    }),
    ...(subcategoryId && { subcategoryId }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
        subcategory: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { recommendationIds, specifications, ...data } = parsed.data;

    const product = await prisma.product.create({
      data: {
        ...data,
        description: sanitizeHtml(data.description, {
          allowedTags: ["p", "strong", "em", "ul", "ol", "li", "h2", "h3", "a", "br"],
          allowedAttributes: { a: ["href"] },
        }),
        specifications: specifications ? JSON.stringify(specifications) : null,
        ...(recommendationIds?.length && {
          recommendations: {
            connect: recommendationIds.map((id) => ({ id })),
          },
        }),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Eroare la crearea produsului";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
