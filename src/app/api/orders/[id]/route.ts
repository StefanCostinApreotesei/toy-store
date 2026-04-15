import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import { sendEmail } from "@/lib/email";
import { orderStatusEmail } from "@/lib/email-templates/order-status";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Comandă negăsită" }, { status: 404 });
  }

  // Allow access only to: the order owner, or an admin
  const isOwner = session?.user?.id && order.userId === session.user.id;
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 403 });
  }

  return NextResponse.json(order);
}

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
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Status invalid" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      include: { user: { select: { name: true, email: true } } },
    });

    // Send status notification email
    const customerEmail = order.user?.email || order.guestEmail;
    const customerName = order.user?.name || order.guestName || "Client";
    const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (customerEmail && parsed.data.status !== "PENDING") {
      sendEmail({
        to: customerEmail,
        subject: `Comandă ${order.orderNumber} — ${parsed.data.status === "CONFIRMED" ? "Confirmată" : parsed.data.status === "SHIPPED" ? "Expediată" : parsed.data.status === "DELIVERED" ? "Livrată" : "Anulată"}`,
        html: orderStatusEmail({
          orderNumber: order.orderNumber,
          customerName,
          status: parsed.data.status,
          siteUrl,
        }),
      }).catch((err) => console.error("Failed to send status email:", err));
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Eroare la actualizarea comenzii" },
      { status: 500 }
    );
  }
}
