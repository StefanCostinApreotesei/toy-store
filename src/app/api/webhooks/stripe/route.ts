import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/email-templates/order-confirmation";
import { adminNewOrderEmail } from "@/lib/email-templates/admin-new-order";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("Stripe webhook: missing orderId in metadata");
      return NextResponse.json({ received: true });
    }

    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
        include: {
          items: { include: { product: true } },
          user: true,
        },
      });

      // Send confirmation emails
      const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      let address: Record<string, string> = {};
      try {
        address = JSON.parse(order.shippingAddress);
      } catch {
        address = {};
      }

      const customerEmail =
        order.user?.email || order.guestEmail || address.email;
      const customerName =
        order.guestName ||
        order.user?.name ||
        `${address.firstName || ""} ${address.lastName || ""}`.trim();

      const orderItemsForEmail = order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      if (customerEmail) {
        sendEmail({
          to: customerEmail,
          subject: `Comandă confirmată — ${order.orderNumber}`,
          html: orderConfirmationEmail({
            orderNumber: order.orderNumber,
            customerName: customerName || "Client",
            items: orderItemsForEmail,
            totalAmount: order.totalAmount,
            shippingAddress: address as {
              firstName: string;
              lastName: string;
              street: string;
              city: string;
              county: string;
              postalCode: string;
              phone: string;
            },
            siteUrl,
          }),
        }).catch((err) =>
          console.error("Failed to send order confirmation email:", err)
        );
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        sendEmail({
          to: adminEmail,
          subject: `Comandă plătită online — ${order.orderNumber} (${order.totalAmount.toFixed(2)} Lei)`,
          html: adminNewOrderEmail({
            orderNumber: order.orderNumber,
            customerName: customerName || "Client",
            customerEmail: customerEmail || "N/A",
            totalAmount: order.totalAmount,
            itemCount: order.items.length,
            siteUrl,
          }),
        }).catch((err) =>
          console.error("Failed to send admin notification email:", err)
        );
      }
    } catch (err) {
      console.error("Stripe webhook: error processing order:", err);
      return NextResponse.json(
        { error: "Error processing order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
