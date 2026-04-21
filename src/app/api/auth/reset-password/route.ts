import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod/v4";

const schema = z.object({
  token: z.string().min(1, "Token invalid"),
  password: z.string()
    .min(8, "Parola trebuie să aibă cel puțin 8 caractere")
    .max(128)
    .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o literă mare")
    .regex(/[a-z]/, "Parola trebuie să conțină cel puțin o literă mică")
    .regex(/[0-9]/, "Parola trebuie să conțină cel puțin o cifră"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // Tokens are stored hashed; the raw value only exists in the email link.
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Link-ul de resetare este invalid." },
        { status: 400 }
      );
    }

    if (resetToken.usedAt) {
      return NextResponse.json(
        { error: "Link-ul de resetare a fost deja folosit." },
        { status: 400 }
      );
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json(
        { error: "Link-ul de resetare a expirat. Solicită unul nou." },
        { status: 400 }
      );
    }

    // Update password and mark token as used
    const hashedPassword = await hash(password, 12);

    // Bumping tokenVersion invalidates any JWTs minted before this reset.
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          hashedPassword,
          tokenVersion: { increment: 1 },
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "Parola a fost schimbată cu succes." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Eroare la resetarea parolei." },
      { status: 500 }
    );
  }
}
