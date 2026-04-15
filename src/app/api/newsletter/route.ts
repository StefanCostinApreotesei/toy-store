import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const schema = z.object({
  email: z.email("Adresă de email invalidă"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Date invalide" },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { error: "Ești deja abonat la newsletter." },
          { status: 409 }
        );
      }
      // Reactivate
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { active: true },
      });
      return NextResponse.json({ message: "Te-ai re-abonat cu succes!" });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({ message: "Te-ai abonat cu succes! Mulțumim!" });
  } catch {
    return NextResponse.json(
      { error: "Eroare internă. Încearcă din nou." },
      { status: 500 }
    );
  }
}
