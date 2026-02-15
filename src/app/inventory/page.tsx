"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  buyPrice: number;
  sellPrice: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "low") {
      return product.stock > 0 && product.stock <= product.minStock;
    }
    if (filter === "out") {
      return product.stock === 0;
    }
    return true;
  });

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= p.minStock
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: "Habis", color: "bg-red-100 text-red-800" };
    }
    if (product.stock <= product.minStock) {
      return { label: "Stok Rendah", color: "bg-yellow-100 text-yellow-800" };
    }
    return { label: "Tersedia", color: "bg-green-100 text-green-800" };
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Memuat data inventaris...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventaris</h1>
        <p className="text-gray-600 mt-1">Kelola stok dan inventaris produk</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Produk</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {products.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Stok</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-200">
          <div className="text-sm text-yellow-800">Stok Rendah</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">
            {lowStockCount}
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
          <div className="text-sm text-red-800">Habis</div>
          <div className="text-2xl font-bold text-red-900 mt-1">
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                filter === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Semua Produk ({products.length})
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                filter === "low"
                  ? "border-yellow-500 text-yellow-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Stok Rendah ({lowStockCount})
            </button>
            <button
              onClick={() => setFilter("out")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                filter === "out"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Habis ({outOfStockCount})
            </button>
          </nav>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min. Stok
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nilai Stok
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Tidak ada produk ditemukan
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const status = getStockStatus(product);
                const stockValue = product.stock * product.buyPrice;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {product.stock} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.minStock} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Rp {stockValue.toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Total Stock Value */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-blue-800 font-medium">
              Total Nilai Inventaris
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Berdasarkan harga beli
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            Rp{" "}
            {products
              .reduce((sum, p) => sum + p.stock * p.buyPrice, 0)
              .toLocaleString("id-ID")}
          </div>
        </div>
      </div>
    </div>
  );
}
