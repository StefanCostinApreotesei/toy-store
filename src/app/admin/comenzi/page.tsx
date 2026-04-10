import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ORDER_STATUSES } from "@/lib/constants";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow/20 text-darkgray",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green/20 text-green-dark",
  CANCELLED: "bg-red-100 text-red-700",
};

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const statusFilter = sp.status || "";
  const limit = 20;

  const where = statusFilter ? { status: statusFilter } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-bold text-darkgray mb-6">Comenzi</h1>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/comenzi"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !statusFilter
              ? "bg-coral text-white"
              : "bg-white border border-gray-200 text-darkgray hover:bg-lightgray"
          }`}
        >
          Toate ({total})
        </Link>
        {Object.entries(ORDER_STATUSES).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/comenzi?status=${key}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === key
                ? "bg-coral text-white"
                : "bg-white border border-gray-200 text-darkgray hover:bg-lightgray"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-lightgray">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-darkgray">Comandă</th>
                <th className="text-left px-4 py-3 font-medium text-darkgray">Client</th>
                <th className="text-left px-4 py-3 font-medium text-darkgray">Produse</th>
                <th className="text-right px-4 py-3 font-medium text-darkgray">Total</th>
                <th className="text-center px-4 py-3 font-medium text-darkgray">Status</th>
                <th className="text-right px-4 py-3 font-medium text-darkgray">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-lightgray/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/comenzi/${order.id}`}
                      className="font-medium text-coral hover:text-coral-dark"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-darkgray-light">
                    {order.user?.name || order.guestName || "Guest"}
                    <br />
                    <span className="text-xs">
                      {order.user?.email || order.guestEmail}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-darkgray-light">
                    {order.items.length} produse
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-darkgray">
                    {order.totalAmount.toFixed(2).replace(".", ",")} Lei
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        STATUS_COLORS[order.status] || "bg-gray-100"
                      }`}
                    >
                      {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-darkgray-light text-xs">
                    {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <p className="text-center py-8 text-darkgray-light">Nicio comandă găsită</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/comenzi?page=${p}${statusFilter ? `&status=${statusFilter}` : ""}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm ${
                p === page
                  ? "bg-coral text-white font-bold"
                  : "bg-white border border-gray-200 text-darkgray hover:bg-coral hover:text-white"
              } transition-colors`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
