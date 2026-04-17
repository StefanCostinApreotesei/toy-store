import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates/password-reset";
import { rateLimit } from "@/lib/rate-limit";
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

    // Per-email rate limit: 3 requests / hour. Applied regardless of whether
    // the email exists so it doesn't leak which addresses are registered.
    const normalizedEmail = email.trim().toLowerCase();
    const { success } = rateLimit(`forgot-password:${normalizedEmail}`, 3, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json({ message: "Dacă adresa există, vei primi un email." });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json({ message: "Dacă adresa există, vei primi un email." });
    }

    // Invalidate existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Raw token is emailed to the user; only the sha256 hash is persisted,
    // so a database leak doesn't hand over usable reset links.
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        token: tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/cont/resetare-parola?token=${rawToken}`;

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
