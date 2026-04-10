import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateProductSchema } from "@/lib/validations/product";
import sanitizeHtml from "sanitize-html";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      subcategory: { include: { category: true } },
      recommendations: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Produs negăsit" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { recommendationIds, specifications, ...data } = parsed.data;

    const updateData: Record<string, unknown> = { ...data };

    if (data.description) {
      updateData.description = sanitizeHtml(data.description, {
        allowedTags: ["p", "strong", "em", "ul", "ol", "li", "h2", "h3", "a", "br"],
        allowedAttributes: { a: ["href"] },
      });
    }

    if (specifications !== undefined) {
      updateData.specifications = specifications ? JSON.stringify(specifications) : null;
    }

    if (recommendationIds !== undefined) {
      updateData.recommendations = {
        set: recommendationIds.map((rid: string) => ({ id: rid })),
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Eroare la actualizarea produsului";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Produs șters" });
  } catch {
    return NextResponse.json({ error: "Eroare la ștergerea produsului" }, { status: 500 });
  }
}
