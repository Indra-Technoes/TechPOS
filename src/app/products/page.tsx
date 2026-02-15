import { db } from "@/db";
import { products, categories, suppliers } from "@/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";

export default async function ProductsPage() {
  const allProducts = await db
    .select({
      id: products.id,
      sku: products.sku,
      name: products.name,
      sellingPrice: products.sellingPrice,
      purchasePrice: products.purchasePrice,
      stock: products.stock,
      minStock: products.minStock,
      unit: products.unit,
      categoryId: products.categoryId,
      supplierId: products.supplierId,
      isActive: products.isActive,
    })
    .from(products)
    .orderBy(sql`${products.createdAt} DESC`);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Produk</h1>
          <p className="text-gray-600 mt-1">Kelola semua produk Anda</p>
        </div>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          + Tambah Produk
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Produk</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {allProducts.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Produk Aktif</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {allProducts.filter((p) => p.isActive).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Stok Menipis</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {allProducts.filter((p) => p.stock <= (p.minStock || 0)).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Stok Habis</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {allProducts.filter((p) => p.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Beli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Jual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Belum ada produk. Tambahkan produk pertama Anda!
                  </td>
                </tr>
              ) : (
                allProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {product.purchasePrice.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      Rp {product.sellingPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock <= (product.minStock || 0)
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </Link>
                      <button className="text-red-600 hover:text-red-800">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
