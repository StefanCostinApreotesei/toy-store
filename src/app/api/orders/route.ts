import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations/order";
import { generateOrderNumber } from "@/lib/utils";

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

    const { items, shippingAddress, notes } = parsed.data;

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

    // Add shipping cost
    const shippingCost = totalAmount >= 200 ? 0 : 15;
    totalAmount += shippingCost;

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: "PENDING",
          totalAmount,
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

      return newOrder;
    });

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
