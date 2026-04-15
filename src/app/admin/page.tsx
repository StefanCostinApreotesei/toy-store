import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    monthRevenue,
    lastMonthRevenue,
    totalCustomers,
    recentOrders,
    lowStockProducts,
    topProducts,
    activeCoupons,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" }, createdAt: { gte: startOfMonth } },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.coupon.count({ where: { active: true } }),
  ]);

  // Fetch product names for top products
  const topProductIds = topProducts.map((p) => p.productId);
  const topProductDetails = topProductIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        select: { id: true, name: true },
      })
    : [];

  const topProductsWithNames = topProducts.map((p) => ({
    ...p,
    name: topProductDetails.find((d) => d.id === p.productId)?.name || "—",
  }));

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    monthRevenue: monthRevenue._sum.totalAmount || 0,
    lastMonthRevenue: lastMonthRevenue._sum.totalAmount || 0,
    totalCustomers,
    recentOrders,
    lowStockProducts,
    topProducts: topProductsWithNames,
    activeCoupons,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const monthRevenueChange =
    data.lastMonthRevenue > 0
      ? ((data.monthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100
      : 0;

  const statusItems = [
    { label: "În așteptare", count: data.pendingOrders, color: "bg-yellow/20 text-darkgray" },
    { label: "Confirmate", count: data.confirmedOrders, color: "bg-blue-100 text-blue-700" },
    { label: "Expediate", count: data.shippedOrders, color: "bg-purple-100 text-purple-700" },
    { label: "Livrate", count: data.deliveredOrders, color: "bg-green/10 text-green" },
    { label: "Anulate", count: data.cancelledOrders, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-darkgray mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <p className="text-2xl font-bold text-green">
                {data.monthRevenue.toFixed(2).replace(".", ",")} Lei
              </p>
              <p className="text-sm text-darkgray-light">Venituri luna aceasta</p>
              {data.lastMonthRevenue > 0 && (
                <p className={`text-xs font-medium ${monthRevenueChange >= 0 ? "text-green" : "text-red-500"}`}>
                  {monthRevenueChange >= 0 ? "+" : ""}{monthRevenueChange.toFixed(1)}% vs. luna trecută
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div>
              <p className="text-2xl font-bold text-darkgray">{data.totalOrders}</p>
              <p className="text-sm text-darkgray-light">Comenzi totale</p>
              <p className="text-xs text-darkgray-light">
                Total: {data.totalRevenue.toFixed(2).replace(".", ",")} Lei
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👥</span>
            <div>
              <p className="text-2xl font-bold text-darkgray">{data.totalCustomers}</p>
              <p className="text-sm text-darkgray-light">Clienți înregistrați</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <div>
              <p className="text-2xl font-bold text-darkgray">{data.totalProducts}</p>
              <p className="text-sm text-darkgray-light">Produse</p>
              <p className="text-xs text-darkgray-light">
                {data.activeCoupons} cupoane active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h2 className="font-bold text-darkgray mb-4">Comenzi după status</h2>
        <div className="flex flex-wrap gap-3">
          {statusItems.map((item) => (
            <div key={item.label} className={`px-4 py-2.5 rounded-lg ${item.color}`}>
              <p className="text-lg font-bold">{item.count}</p>
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-darkgray">Comenzi recente</h2>
            <Link href="/admin/comenzi" className="text-sm text-coral hover:text-coral-dark">
              Vezi toate →
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-darkgray-light py-4">Nicio comandă încă</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/comenzi/${order.id}`}
                  className="flex items-center justify-between py-2 hover:bg-lightgray rounded px-2 -mx-2 transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-darkgray">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-darkgray-light ml-2">
                      {order.items.length} produse
                    </span>
                  </div>
                  <span className="text-sm font-bold text-darkgray">
                    {order.totalAmount.toFixed(2).replace(".", ",")} Lei
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-darkgray">Top produse vândute</h2>
            <Link href="/admin/produse" className="text-sm text-coral hover:text-coral-dark">
              Produse →
            </Link>
          </div>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-darkgray-light py-4">Nicio vânzare încă</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((item, idx) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-darkgray-light w-5">
                      #{idx + 1}
                    </span>
                    <span className="text-sm text-darkgray line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-coral/10 text-coral px-2 py-0.5 rounded flex-shrink-0">
                    {item._sum.quantity} buc.
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-darkgray">Stoc scăzut</h2>
            <Link href="/admin/produse" className="text-sm text-coral hover:text-coral-dark">
              Produse →
            </Link>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-green py-4">Toate produsele au stoc suficient</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/produse/${product.id}/editare`}
                  className="flex items-center justify-between py-2 hover:bg-lightgray rounded px-2 -mx-2 transition-colors"
                >
                  <span className="text-sm text-darkgray line-clamp-1">
                    {product.name}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      product.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow/20 text-darkgray"
                    }`}
                  >
                    {product.stock === 0 ? "Epuizat" : `${product.stock} buc.`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
