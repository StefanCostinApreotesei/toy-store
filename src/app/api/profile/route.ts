import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";
import { hash, compare } from "bcrypt";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Parola curentă este obligatorie"),
    newPassword: z.string().min(8, "Parola nouă trebuie să aibă cel puțin 8 caractere"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parolele nu se potrivesc",
    path: ["confirmPassword"],
  });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilizator negăsit" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const body = await request.json();

  // Check if it's a password change request
  if (body.currentPassword) {
    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Date invalide" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ error: "Utilizator negăsit" }, { status: 404 });
    }

    const isValid = await compare(result.data.currentPassword, user.hashedPassword);
    if (!isValid) {
      return NextResponse.json({ error: "Parola curentă este incorectă" }, { status: 400 });
    }

    const hashedPassword = await hash(result.data.newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    });

    return NextResponse.json({ message: "Parola a fost schimbată cu succes" });
  }

  // Profile update
  const result = updateProfileSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message || "Date invalide" },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: result.data.name,
      phone: result.data.phone || null,
    },
    select: { id: true, name: true, email: true, phone: true },
  });

  return NextResponse.json(updated);
}
