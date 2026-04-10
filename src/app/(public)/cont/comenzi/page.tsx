import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ORDER_STATUSES } from "@/lib/constants";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comenzile mele",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow/20 text-darkgray",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green/20 text-green-dark",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/cont");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs
        items={[
          { label: "Contul meu", href: "/cont" },
          { label: "Comenzile mele" },
        ]}
      />

      <h1 className="text-2xl font-bold text-darkgray mb-6">Comenzile mele</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">📦</span>
          <p className="text-darkgray-light mb-4">Nu ai nicio comandă încă</p>
          <Link
            href="/categorii"
            className="inline-block bg-coral text-white font-bold px-6 py-3 rounded-lg hover:bg-coral-dark transition-colors"
          >
            Începe cumpărăturile
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/cont/comenzi/${order.id}`}
              className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-darkgray">
                    {order.orderNumber}
                  </span>
                  <span className="text-sm text-darkgray-light ml-3">
                    {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    STATUS_COLORS[order.status] || "bg-gray-100"
                  }`}
                >
                  {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]}
                </span>
              </div>

              <div className="text-sm text-darkgray-light mb-2">
                {order.items.length}{" "}
                {order.items.length === 1 ? "produs" : "produse"}:{" "}
                {order.items
                  .map((i) => i.product.name)
                  .slice(0, 3)
                  .join(", ")}
                {order.items.length > 3 && "..."}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-darkgray">
                  {order.totalAmount.toFixed(2).replace(".", ",")} Lei
                </span>
                <span className="text-coral text-sm font-medium">
                  Vezi detalii →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
