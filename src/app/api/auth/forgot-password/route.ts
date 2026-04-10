import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates/password-reset";
import { z } from "zod/v4";

const schema = z.object({
  email: z.email("Email invalid"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ message: "Dacă adresa există, vei primi un email." });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal that the email doesn't exist
      return NextResponse.json({ message: "Dacă adresa există, vei primi un email." });
    }

    // Invalidate existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Create new token (1 hour expiry)
    const token = crypto.randomUUID();
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/cont/resetare-parola?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Resetare parolă — JucăriiShop",
      html: passwordResetEmail({
        name: user.name || "Client",
        resetUrl,
      }),
    });

    return NextResponse.json({ message: "Dacă adresa există, vei primi un email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Dacă adresa există, vei primi un email." });
  }
}
