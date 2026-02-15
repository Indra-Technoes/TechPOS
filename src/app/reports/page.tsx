import { db } from "@/db";
import { transactions, products, stockHistory } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function ReportsPage() {
  // Laporan Penjualan
  const allTransactions = await db.select().from(transactions);
  const totalRevenue = allTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalCost = allTransactions.reduce((sum, t) => sum + t.subtotal, 0);
  const totalProfit = totalRevenue - totalCost;

  // Laporan Stok
  const allProducts = await db.select().from(products);
  const totalProducts = allProducts.length;
  const lowStockProducts = allProducts.filter((p) => p.stock <= (p.minStock || 0));
  const outOfStockProducts = allProducts.filter((p) => p.stock === 0);

  // Pembayaran per metode
  const cashTransactions = allTransactions.filter((t) => t.paymentMethod === "cash");
  const qrisTransactions = allTransactions.filter((t) => t.paymentMethod === "qris");
  const transferTransactions = allTransactions.filter((t) => t.paymentMethod === "transfer");

  const cashTotal = cashTransactions.reduce((sum, t) => sum + t.total, 0);
  const qrisTotal = qrisTransactions.reduce((sum, t) => sum + t.total, 0);
  const transferTotal = transferTransactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📈 Laporan</h1>
        <p className="text-gray-600 mt-1">Ringkasan laporan bisnis Anda</p>
      </div>

      {/* Laporan Akuntansi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💰 Laporan Akuntansi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Total Pendapatan</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {allTransactions.length} transaksi
            </p>
          </div>
          <div className="p-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 font-medium">Total Biaya</p>
            <p className="text-3xl font-bold text-red-900 mt-2">
              Rp {totalCost.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-red-600 mt-1">HPP & Operasional</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">Laba Bersih</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              Rp {totalProfit.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Margin: {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Laporan Stok */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📦 Laporan Stok Penjualan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Produk</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600">Stok Aman</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {totalProducts - lowStockProducts.length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600">Stok Menipis</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">
              {lowStockProducts.length}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600">Stok Habis</p>
            <p className="text-2xl font-bold text-red-900 mt-1">
              {outOfStockProducts.length}
            </p>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              ⚠️ Produk yang Perlu Direstock
            </h3>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
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
                      Min: {product.minStock || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Laporan Pembayaran */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💳 Laporan Metode Pembayaran
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-600 font-medium">💵 Tunai</p>
              <span className="text-2xl">💵</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              Rp {cashTotal.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {cashTransactions.length} transaksi
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-600 font-medium">📱 QRIS</p>
              <span className="text-2xl">📱</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              Rp {qrisTotal.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {qrisTransactions.length} transaksi
            </p>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-purple-600 font-medium">🏦 Transfer</p>
              <span className="text-2xl">🏦</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              Rp {transferTotal.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-purple-600 mt-1">
              {transferTransactions.length} transaksi
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📥 Export Laporan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <span className="text-3xl mb-2 block">📄</span>
            <span className="text-sm font-medium text-gray-900">Export PDF</span>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <span className="text-3xl mb-2 block">📊</span>
            <span className="text-sm font-medium text-gray-900">Export Excel</span>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <span className="text-3xl mb-2 block">📧</span>
            <span className="text-sm font-medium text-gray-900">Email Laporan</span>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
            <span className="text-3xl mb-2 block">🖨️</span>
            <span className="text-sm font-medium text-gray-900">Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
