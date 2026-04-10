import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getDashboardData() {
  const [totalProducts, totalOrders, pendingOrders, totalRevenue, recentOrders, lowStockProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "CANCELLED" } } }),
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
    ]);

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    recentOrders,
    lowStockProducts,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-bold text-darkgray mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <div>
              <p className="text-2xl font-bold text-darkgray">{data.totalProducts}</p>
              <p className="text-sm text-darkgray-light">Produse</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div>
              <p className="text-2xl font-bold text-darkgray">{data.totalOrders}</p>
              <p className="text-sm text-darkgray-light">Comenzi totale</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏳</span>
            <div>
              <p className="text-2xl font-bold text-coral">{data.pendingOrders}</p>
              <p className="text-sm text-darkgray-light">Comenzi în așteptare</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <p className="text-2xl font-bold text-green">
                {data.totalRevenue.toFixed(2).replace(".", ",")} Lei
              </p>
              <p className="text-sm text-darkgray-light">Venituri totale</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Low Stock */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-darkgray">Stoc scăzut</h2>
            <Link href="/admin/produse" className="text-sm text-coral hover:text-coral-dark">
              Vezi produse →
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
