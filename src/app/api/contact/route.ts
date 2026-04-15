import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { sendEmail } from "@/lib/email";
import { contactMessageEmail } from "@/lib/email-templates/contact-message";

const schema = z.object({
  name: z.string().min(2, "Numele este obligatoriu").max(100),
  email: z.email("Email invalid"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(3, "Subiectul este obligatoriu").max(200),
  message: z.string().min(10, "Mesajul trebuie să aibă cel puțin 10 caractere").max(5000),
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

    const { name, email, phone, subject, message } = parsed.data;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("ADMIN_EMAIL not configured");
      return NextResponse.json(
        { error: "Serviciul de contact nu este configurat" },
        { status: 500 }
      );
    }

    await sendEmail({
      to: adminEmail,
      subject: `Contact: ${subject} — ${name}`,
      html: contactMessageEmail({ name, email, phone, subject, message }),
    });

    return NextResponse.json({ message: "Mesaj trimis cu succes" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Eroare la trimiterea mesajului" },
      { status: 500 }
    );
  }
}
