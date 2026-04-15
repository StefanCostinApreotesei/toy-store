import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const addressSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phone: z.string().min(6).max(20),
  email: z.email(),
  street: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  county: z.string().min(2).max(100),
  postalCode: z.string().min(4).max(10),
  isDefault: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.shippingAddress.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Adresă negăsită" }, { status: 404 });
  }

  const body = await request.json();
  const result = addressSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Date invalide" },
      { status: 400 }
    );
  }

  const { isDefault, ...data } = result.data;

  if (isDefault) {
    await prisma.shippingAddress.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.shippingAddress.update({
    where: { id },
    data: { ...data, isDefault: isDefault ?? existing.isDefault },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.shippingAddress.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Adresă negăsită" }, { status: 404 });
  }

  await prisma.shippingAddress.delete({ where: { id } });

  // If deleted address was default, set another as default
  if (existing.isDefault) {
    const next = await prisma.shippingAddress.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    if (next) {
      await prisma.shippingAddress.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
    }
  }

  return NextResponse.json({ success: true });
}
