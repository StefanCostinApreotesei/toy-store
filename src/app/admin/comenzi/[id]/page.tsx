import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/constants";
import OrderStatusChanger from "@/components/admin/OrderStatusChanger";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: true } },
    },
  });

  if (!order) notFound();

  const address = JSON.parse(order.shippingAddress);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-darkgray">
          Comandă {order.orderNumber}
        </h1>
        <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-darkgray mb-4">Produse comandate</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="font-medium text-darkgray">{item.product.name}</p>
                    <p className="text-sm text-darkgray-light">
                      {item.quantity} × {item.unitPrice.toFixed(2).replace(".", ",")} Lei
                    </p>
                  </div>
                  <span className="font-bold text-darkgray">
                    {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")} Lei
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-gray-100 pt-3 mt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{order.totalAmount.toFixed(2).replace(".", ",")} Lei</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-darkgray mb-3">Client</h2>
            <div className="text-sm space-y-1 text-darkgray-light">
              <p className="font-medium text-darkgray">
                {order.user?.name || order.guestName || "Guest"}
              </p>
              <p>{order.user?.email || order.guestEmail}</p>
              {(order.user?.phone || order.guestPhone) && (
                <p>{order.user?.phone || order.guestPhone}</p>
              )}
              <p className="text-xs mt-2">
                {order.userId ? "Client înregistrat" : "Comandă guest"}
              </p>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-darkgray mb-3">Adresă livrare</h2>
            <div className="text-sm text-darkgray-light leading-relaxed">
              <p>
                {address.firstName} {address.lastName}
              </p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.county}
              </p>
              <p>{address.postalCode}</p>
              <p>Tel: {address.phone}</p>
            </div>
          </div>

          {/* Order info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-darkgray mb-3">Informații</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-darkgray-light">Status</span>
                <span className="font-medium">
                  {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-darkgray-light">Data</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {order.notes && (
                <div className="pt-2 border-t border-gray-50">
                  <p className="text-darkgray-light text-xs mb-1">Note:</p>
                  <p className="text-darkgray">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
