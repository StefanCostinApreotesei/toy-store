import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";

const updateSchema = z.object({
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().positive().optional(),
  minOrderAmount: z.number().positive().nullable().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return null;
  }
  return session;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.discountType !== undefined) data.discountType = parsed.data.discountType;
    if (parsed.data.discountValue !== undefined) data.discountValue = parsed.data.discountValue;
    if (parsed.data.minOrderAmount !== undefined) data.minOrderAmount = parsed.data.minOrderAmount;
    if (parsed.data.maxUses !== undefined) data.maxUses = parsed.data.maxUses;
    if (parsed.data.expiresAt !== undefined) {
      data.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;
    }
    if (parsed.data.active !== undefined) data.active = parsed.data.active;

    const coupon = await prisma.coupon.update({
      where: { id },
      data,
    });

    return NextResponse.json(coupon);
  } catch {
    return NextResponse.json(
      { error: "Eroare la actualizarea cuponului" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Eroare la ștergerea cuponului" },
      { status: 500 }
    );
  }
}
