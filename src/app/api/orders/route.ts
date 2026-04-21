import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/utils";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/email-templates/order-confirmation";
import { adminNewOrderEmail } from "@/lib/email-templates/admin-new-order";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Date invalide", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { items, shippingAddress, notes, paymentMethod, couponCode } = parsed.data;

    // Get current session (optional - guest checkout allowed)
    const session = await auth();

    // Validate products and stock
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Unul sau mai multe produse nu au fost găsite" },
        { status: 400 }
      );
    }

    // Check stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stoc insuficient pentru "${product?.name || "produs"}"`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    // Validate and calculate coupon discount
    let discountAmount = 0;
    let validatedCouponCode: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.active) {
        return NextResponse.json(
          { error: "Cuponul nu există sau nu este activ" },
          { status: 400 }
        );
      }

      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return NextResponse.json(
          { error: "Cuponul a expirat" },
          { status: 400 }
        );
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json(
          { error: "Cuponul a atins limita de utilizări" },
          { status: 400 }
        );
      }

      if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
        return NextResponse.json(
          { error: `Comanda minimă pentru acest cupon este ${coupon.minOrderAmount.toFixed(2).replace(".", ",")} Lei` },
          { status: 400 }
        );
      }

      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = Math.round(totalAmount * (coupon.discountValue / 100) * 100) / 100;
      } else {
        discountAmount = Math.min(coupon.discountValue, totalAmount);
      }

      validatedCouponCode = coupon.code;
    }

    // Add shipping cost
    const shippingCost = totalAmount >= 200 ? 0 : 15;
    totalAmount += shippingCost - discountAmount;

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: "PENDING",
          paymentMethod,
          totalAmount,
          couponCode: validatedCouponCode,
          discountAmount,
          userId: session?.user?.id || null,
          guestEmail: !session ? shippingAddress.email : null,
          guestName: !session
            ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
            : null,
          guestPhone: !session ? shippingAddress.phone : null,
          shippingAddress: JSON.stringify(shippingAddress),
          notes: notes || null,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // Decrease stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Increment coupon usage
      if (validatedCouponCode) {
        await tx.coupon.update({
          where: { code: validatedCouponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // If Stripe, create checkout session and return URL
    if (paymentMethod === "STRIPE") {
      const stripeSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            price_data: {
              currency: "ron",
              product_data: {
                name: product.name,
              },
              unit_amount: Math.round(product.price * 100), // Stripe uses cents
            },
            quantity: item.quantity,
          };
        }),
        ...(shippingCost > 0 && {
          shipping_options: [
            {
              shipping_rate_data: {
                display_name: "Livrare standard",
                type: "fixed_amount" as const,
                fixed_amount: {
                  amount: Math.round(shippingCost * 100),
                  currency: "ron",
                },
              },
            },
          ],
        }),
        metadata: {
          orderId: order.id,
        },
        success_url: `${siteUrl}/checkout/confirmare/${order.id}`,
        cancel_url: `${siteUrl}/checkout?cancelled=1`,
      });

      // Save stripe session ID on order
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: stripeSession.id },
      });

      return NextResponse.json(
        {
          message: "Redirect la plată",
          orderId: order.id,
          orderNumber: order.orderNumber,
          stripeUrl: stripeSession.url,
        },
        { status: 201 }
      );
    }

    // COD flow — send emails immediately
    const customerEmail = session?.user?.email || shippingAddress.email;
    const customerName = `${shippingAddress.firstName} ${shippingAddress.lastName}`;

    // Get product names for email
    const orderItemsForEmail = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    });

    // Email to customer
    if (customerEmail) {
      sendEmail({
        to: customerEmail,
        subject: `Comandă confirmată — ${order.orderNumber}`,
        html: orderConfirmationEmail({
          orderNumber: order.orderNumber,
          customerName,
          items: orderItemsForEmail,
          totalAmount: order.totalAmount,
          shippingAddress,
          siteUrl,
        }),
      }).catch((err) => console.error("Failed to send order confirmation email:", err));
    }

    // Email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `Comandă nouă — ${order.orderNumber} (${order.totalAmount.toFixed(2)} Lei)`,
        html: adminNewOrderEmail({
          orderNumber: order.orderNumber,
          customerName,
          customerEmail: customerEmail || "N/A",
          totalAmount: order.totalAmount,
          itemCount: items.length,
          siteUrl,
        }),
      }).catch((err) => console.error("Failed to send admin notification email:", err));
    }

    return NextResponse.json(
      {
        message: "Comandă plasată cu succes",
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Eroare la crearea comenzii" },
      { status: 500 }
    );
  }
}
