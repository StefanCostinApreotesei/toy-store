import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

// Get reviews for a product
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reviews = await prisma.review.findMany({
    where: { productId: id },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate average
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    reviews,
    averageRating: Math.round(avg * 10) / 10,
    totalReviews: reviews.length,
  });
}

// Create or update review
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Trebuie să fii autentificat pentru a lăsa o recenzie" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: "Produs negăsit" },
        { status: 404 }
      );
    }

    // Upsert — one review per user per product
    const review = await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: id,
          userId: session.user.id,
        },
      },
      update: {
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
      },
      create: {
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
        productId: id,
        userId: session.user.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Eroare la salvarea recenziei" },
      { status: 500 }
    );
  }
}

// Delete own review
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.review.delete({
      where: {
        productId_userId: {
          productId: id,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ message: "Recenzie ștearsă" });
  } catch {
    return NextResponse.json(
      { error: "Recenzia nu a fost găsită" },
      { status: 404 }
    );
  }
}
