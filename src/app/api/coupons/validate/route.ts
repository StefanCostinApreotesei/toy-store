import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const schema = z.object({
  code: z.string().min(1).max(50),
  orderTotal: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Cod invalid" },
        { status: 400 }
      );
    }

    const { code, orderTotal } = parsed.data;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
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

    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          error: `Comanda minimă pentru acest cupon este ${coupon.minOrderAmount.toFixed(2).replace(".", ",")} Lei`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount: number;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round(orderTotal * (coupon.discountValue / 100) * 100) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, orderTotal);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "Eroare la validarea cuponului" },
      { status: 500 }
    );
  }
}
