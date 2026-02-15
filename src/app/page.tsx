import { db } from "@/db";
import { products, transactions, customers, suppliers } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function DashboardPage() {
  // Ambil statistik dari database
  const [productCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);

  const [transactionCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions);

  const [customerCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers);

  const [supplierCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(suppliers);

  // Ambil transaksi terbaru
  const recentTransactions = await db
    .select()
    .from(transactions)
    .orderBy(sql`${transactions.createdAt} DESC`)
    .limit(5);

  // Ambil produk dengan stok menipis
  const lowStockProducts = await db
    .select()
    .from(products)
    .where(sql`${products.stock} <= ${products.minStock}`)
    .limit(5);

  const stats = [
    {
      title: "Total Produk",
      value: productCount.count,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "Total Transaksi",
      value: transactionCount.count,
      icon: "💳",
      color: "bg-green-500",
    },
    {
      title: "Total Pelanggan",
      value: customerCount.count,
      icon: "👥",
      color: "bg-purple-500",
    },
    {
      title: "Total Supplier",
      value: supplierCount.count,
      icon: "🏭",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan aktivitas bisnis Anda hari ini
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaksi Terbaru */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaksi Terbaru
            </h2>
          </div>
          <div className="p-6">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada transaksi
              </p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.createdAt
                          ? new Date(transaction.createdAt).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rp {transaction.total.toLocaleString("id-ID")}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          transaction.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {transaction.paymentStatus === "paid"
                          ? "Lunas"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stok Menipis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              ⚠️ Stok Menipis
            </h2>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Semua stok aman ✅
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {product.stock} {product.unit}
                      </p>
                      <p className="text-xs text-gray-500">
                        Min: {product.minStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/pos"
            className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="text-4xl mb-2">🛒</span>
            <span className="text-sm font-medium text-gray-900">
              Buka Kasir
            </span>
          </a>
          <a
            href="/products"
            className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="text-4xl mb-2">📦</span>
            <span className="text-sm font-medium text-gray-900">
              Tambah Produk
            </span>
          </a>
          <a
            href="/purchase-orders"
            className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <span className="text-4xl mb-2">📝</span>
            <span className="text-sm font-medium text-gray-900">
              Order Barang
            </span>
          </a>
          <a
            href="/reports"
            className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <span className="text-4xl mb-2">📈</span>
            <span className="text-sm font-medium text-gray-900">
              Lihat Laporan
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
