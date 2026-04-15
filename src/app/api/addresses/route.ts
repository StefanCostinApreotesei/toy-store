import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const addressSchema = z.object({
  firstName: z.string().min(2, "Prenumele este obligatoriu").max(100),
  lastName: z.string().min(2, "Numele este obligatoriu").max(100),
  phone: z.string().min(6, "Telefonul este obligatoriu").max(20),
  email: z.email("Email invalid"),
  street: z.string().min(3, "Adresa este obligatorie").max(200),
  city: z.string().min(2, "Orașul este obligatoriu").max(100),
  county: z.string().min(2, "Județul este obligatoriu").max(100),
  postalCode: z.string().min(4, "Codul poștal este obligatoriu").max(10),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const addresses = await prisma.shippingAddress.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
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

  // If setting as default, clear other defaults
  if (isDefault) {
    await prisma.shippingAddress.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  // Check if first address — auto-set as default
  const count = await prisma.shippingAddress.count({
    where: { userId: session.user.id },
  });

  const address = await prisma.shippingAddress.create({
    data: {
      ...data,
      isDefault: isDefault || count === 0,
      userId: session.user.id,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
