import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import { ORDER_STATUSES } from "@/lib/constants";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/cont");

  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  let address: Record<string, string> = {};
  try {
    address = JSON.parse(order.shippingAddress);
  } catch {
    address = {};
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <Breadcrumbs
        items={[
          { label: "Contul meu", href: "/cont" },
          { label: "Comenzile mele", href: "/cont/comenzi" },
          { label: order.orderNumber },
        ]}
      />

      <h1 className="text-2xl font-bold text-darkgray mb-6">
        Comandă {order.orderNumber}
      </h1>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-darkgray-light">Status</span>
            <p className="font-bold text-darkgray mt-1">
              {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]}
            </p>
          </div>
          <div>
            <span className="text-darkgray-light">Data comenzii</span>
            <p className="font-bold text-darkgray mt-1">
              {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-darkgray mb-4">Produse</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-darkgray font-medium">{item.product.name}</p>
                <p className="text-darkgray-light">
                  {item.quantity} × {item.unitPrice.toFixed(2).replace(".", ",")} Lei
                </p>
              </div>
              <span className="font-bold text-darkgray">
                {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")} Lei
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{order.totalAmount.toFixed(2).replace(".", ",")} Lei</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-darkgray mb-3">Adresă livrare</h2>
        <p className="text-sm text-darkgray-light leading-relaxed">
          {address.firstName || ""} {address.lastName || ""}
          <br />
          {address.street || ""}
          <br />
          {address.city || ""}{address.county ? `, ${address.county}` : ""} {address.postalCode || ""}
          <br />
          {address.phone ? `Tel: ${address.phone}` : ""}{address.email ? ` | Email: ${address.email}` : ""}
        </p>
      </div>
    </div>
  );
}
