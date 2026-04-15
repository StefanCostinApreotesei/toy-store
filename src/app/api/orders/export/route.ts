import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { name: true } } } },
      user: { select: { name: true, email: true } },
    },
  });

  const BOM = "\uFEFF";
  const headers = [
    "Nr. Comandă",
    "Data",
    "Client",
    "Email",
    "Telefon",
    "Status",
    "Plată",
    "Produse",
    "Cupon",
    "Reducere",
    "Total",
    "Adresă",
    "Note",
  ];

  const rows = orders.map((order) => {
    const address = JSON.parse(order.shippingAddress);
    const customerName = order.user?.name || order.guestName || "";
    const customerEmail = order.user?.email || order.guestEmail || "";
    const customerPhone = address.phone || order.guestPhone || "";
    const products = order.items
      .map((item) => `${item.product.name} x${item.quantity}`)
      .join("; ");
    const fullAddress = `${address.street}, ${address.city}, ${address.county} ${address.postalCode}`;

    return [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString("ro-RO"),
      customerName,
      customerEmail,
      customerPhone,
      order.status,
      order.paymentMethod,
      products,
      order.couponCode || "",
      order.discountAmount.toFixed(2),
      order.totalAmount.toFixed(2),
      fullAddress,
      order.notes || "",
    ];
  });

  const csvContent =
    BOM +
    headers.map(escapeCSV).join(",") +
    "\n" +
    rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="comenzi-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

function escapeCSV(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
