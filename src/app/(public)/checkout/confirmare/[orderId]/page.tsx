import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ORDER_STATUSES } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ orderId: string }>;
}

export const metadata: Metadata = {
  title: "Comandă confirmată",
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) notFound();

  const address = JSON.parse(order.shippingAddress);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <span className="text-6xl mb-4 block">✅</span>
        <h1 className="text-2xl font-bold text-darkgray mb-2">
          Comanda a fost plasată!
        </h1>
        <p className="text-darkgray-light">
          Număr comandă:{" "}
          <span className="font-bold text-coral">{order.orderNumber}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-darkgray mb-4">Detalii comandă</h2>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-darkgray-light">Status</span>
            <span className="bg-yellow/20 text-darkgray text-xs font-bold px-2 py-0.5 rounded">
              {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-darkgray-light">Data</span>
            <span className="text-darkgray">
              {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-darkgray">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")} Lei
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{order.totalAmount.toFixed(2).replace(".", ",")} Lei</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-darkgray mb-3">Adresă livrare</h2>
        <p className="text-sm text-darkgray-light">
          {address.firstName} {address.lastName}
          <br />
          {address.street}
          <br />
          {address.city}, {address.county} {address.postalCode}
          <br />
          Tel: {address.phone}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 text-center bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors"
        >
          Înapoi la magazin
        </Link>
        <Link
          href="/cont/comenzi"
          className="flex-1 text-center border-2 border-coral text-coral font-bold py-3 rounded-lg hover:bg-coral/5 transition-colors"
        >
          Vezi comenzile
        </Link>
      </div>
    </div>
  );
}
