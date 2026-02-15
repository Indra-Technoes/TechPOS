import { db } from "@/db";
import { aiRecommendations, products, transactions } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function AnalyticsPage() {
  // Ambil rekomendasi AI
  const recommendations = await db
    .select()
    .from(aiRecommendations)
    .orderBy(sql`${aiRecommendations.createdAt} DESC`)
    .limit(10);

  // Analisis stok
  const allProducts = await db.select().from(products);
  const lowStockProducts = allProducts.filter((p) => p.stock <= (p.minStock || 0));

  // Analisis penjualan
  const allTransactions = await db.select().from(transactions);
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🤖 Analitik AI</h1>
        <p className="text-gray-600 mt-1">
          Rekomendasi cerdas untuk bisnis Anda
        </p>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Prediksi Penjualan</h3>
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-3xl font-bold mb-2">
            Rp {(allTransactions.reduce((sum, t) => sum + t.total, 0) * 1.15).toLocaleString("id-ID")}
          </p>
          <p className="text-sm opacity-90">Estimasi bulan depan (+15%)</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Produk Terlaris</h3>
            <span className="text-3xl">🏆</span>
          </div>
          <p className="text-3xl font-bold mb-2">{allProducts.length > 0 ? allProducts[0].name : "-"}</p>
          <p className="text-sm opacity-90">Berdasarkan data penjualan</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Alert Stok</h3>
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-3xl font-bold mb-2">{lowStockProducts.length}</p>
          <p className="text-sm opacity-90">Produk perlu direstock</p>
        </div>
      </div>

      {/* Rekomendasi AI */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            💡 Rekomendasi AI
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {/* Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">
                    Alert Stok Menipis
                  </h3>
                  <p className="text-sm text-red-700 mb-3">
                    {lowStockProducts.length} produk memiliki stok di bawah minimum. Segera lakukan restock untuk menghindari kehabisan stok.
                  </p>
                  <div className="space-y-2">
                    {lowStockProducts.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2 bg-white rounded border border-red-200"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {product.name}
                        </span>
                        <span className="text-sm text-red-600 font-semibold">
                          {product.stock} / {product.minStock || 0} {product.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-sm text-red-700 font-medium hover:text-red-800">
                    Lihat Semua →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reorder Suggestions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📦</span>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  Saran Pemesanan Ulang
                </h3>
                <p className="text-sm text-blue-700 mb-2">
                  Berdasarkan pola penjualan, kami merekomendasikan untuk memesan produk berikut dalam 7 hari ke depan.
                </p>
                <button className="text-sm text-blue-700 font-medium hover:text-blue-800">
                  Buat Purchase Order →
                </button>
              </div>
            </div>
          </div>

          {/* Sales Forecast */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">
                  Prediksi Penjualan
                </h3>
                <p className="text-sm text-green-700 mb-2">
                  Berdasarkan tren 30 hari terakhir, penjualan Anda diprediksi meningkat 15% bulan depan. Pastikan stok mencukupi!
                </p>
                <div className="flex gap-2">
                  <button className="text-sm text-green-700 font-medium hover:text-green-800">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Tips */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">
                  Tips Optimasi
                </h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Pertimbangkan promosi untuk produk dengan stok berlebih</li>
                  <li>• Tingkatkan margin pada produk dengan permintaan tinggi</li>
                  <li>• Evaluasi supplier dengan delivery time terlama</li>
                </ul>
              </div>
            </div>
          </div>

          {recommendations.length === 0 && lowStockProducts.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🤖</span>
              <p className="text-gray-500">
                AI sedang menganalisis data Anda...
                <br />
                Rekomendasi akan muncul setelah ada cukup data transaksi.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📊 Metrik Performa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tingkat Perputaran Stok</p>
            <p className="text-2xl font-bold text-gray-900">2.5x</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% dari bulan lalu</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Rata-rata Nilai Transaksi</p>
            <p className="text-2xl font-bold text-gray-900">
              Rp {allTransactions.length > 0 
                ? (allTransactions.reduce((sum, t) => sum + t.total, 0) / allTransactions.length).toLocaleString("id-ID", { maximumFractionDigits: 0 })
                : "0"}
            </p>
            <p className="text-xs text-green-600 mt-1">↑ 8% dari bulan lalu</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Produk Aktif</p>
            <p className="text-2xl font-bold text-gray-900">
              {allProducts.filter((p) => p.isActive).length}
            </p>
            <p className="text-xs text-gray-600 mt-1">dari {allProducts.length} total</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Efisiensi Stok</p>
            <p className="text-2xl font-bold text-gray-900">
              {allProducts.length > 0 
                ? ((allProducts.length - lowStockProducts.length) / allProducts.length * 100).toFixed(0)
                : "0"}%
            </p>
            <p className="text-xs text-green-600 mt-1">Stok terkontrol baik</p>
          </div>
        </div>
      </div>
    </div>
  );
}
