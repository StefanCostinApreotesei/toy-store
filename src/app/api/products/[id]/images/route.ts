import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";

const addImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
});

const reorderSchema = z.object({
  imageIds: z.array(z.string().min(1)),
});

// Add image to product
export async function POST(
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
    const parsed = addImageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Get the next display order
    const lastImage = await prisma.productImage.findFirst({
      where: { productId: id },
      orderBy: { displayOrder: "desc" },
    });

    const image = await prisma.productImage.create({
      data: {
        url: parsed.data.url,
        alt: parsed.data.alt || null,
        displayOrder: (lastImage?.displayOrder ?? -1) + 1,
        productId: id,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Add image error:", error);
    return NextResponse.json(
      { error: "Eroare la adăugarea imaginii" },
      { status: 500 }
    );
  }
}

// Reorder images
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
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Update display order for each image
    await prisma.$transaction(
      parsed.data.imageIds.map((imageId, index) =>
        prisma.productImage.update({
          where: { id: imageId, productId: id },
          data: { displayOrder: index },
        })
      )
    );

    const images = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Reorder images error:", error);
    return NextResponse.json(
      { error: "Eroare la reordonarea imaginilor" },
      { status: 500 }
    );
  }
}

// Delete image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  await params; // consume params

  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId este obligatoriu" },
        { status: 400 }
      );
    }

    await prisma.productImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: "Imagine ștearsă" });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Eroare la ștergerea imaginii" },
      { status: 500 }
    );
  }
}
