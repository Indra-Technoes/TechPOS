"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: "draft" | "sent" | "confirmed" | "received" | "cancelled";
  totalAmount: number;
  items: number;
}

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Sample data - replace with actual API call
    const samplePOs: PurchaseOrder[] = [
      {
        id: 1,
        poNumber: "PO-2024-001",
        supplierId: 1,
        supplierName: "PT Sumber Makmur",
        orderDate: "2024-01-15",
        expectedDate: "2024-01-22",
        status: "confirmed",
        totalAmount: 15000000,
        items: 25,
      },
      {
        id: 2,
        poNumber: "PO-2024-002",
        supplierId: 2,
        supplierName: "CV Berkah Jaya",
        orderDate: "2024-01-18",
        expectedDate: "2024-01-25",
        status: "sent",
        totalAmount: 8500000,
        items: 15,
      },
      {
        id: 3,
        poNumber: "PO-2024-003",
        supplierId: 3,
        supplierName: "UD Maju Bersama",
        orderDate: "2024-01-20",
        expectedDate: "2024-01-27",
        status: "draft",
        totalAmount: 12000000,
        items: 30,
      },
      {
        id: 4,
        poNumber: "PO-2024-004",
        supplierId: 1,
        supplierName: "PT Sumber Makmur",
        orderDate: "2024-01-10",
        expectedDate: "2024-01-17",
        status: "received",
        totalAmount: 20000000,
        items: 40,
      },
    ];
    setPurchaseOrders(samplePOs);
  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      confirmed: "bg-yellow-100 text-yellow-800",
      received: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: "Draft",
      sent: "Terkirim",
      confirmed: "Dikonfirmasi",
      received: "Diterima",
      cancelled: "Dibatalkan",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const filteredPOs = purchaseOrders.filter((po) => {
    if (filter === "all") return true;
    return po.status === filter;
  });

  const stats = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter((po) => po.status === "draft").length,
    sent: purchaseOrders.filter((po) => po.status === "sent").length,
    confirmed: purchaseOrders.filter((po) => po.status === "confirmed").length,
    received: purchaseOrders.filter((po) => po.status === "received").length,
  };

  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Order</h1>
          <p className="text-gray-600 mt-1">Kelola pesanan pembelian dari supplier</p>
        </div>
        <Link
          href="/purchase-orders/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Buat PO Baru
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total PO</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Draft</div>
          <div className="text-2xl font-bold text-gray-500">{stats.draft}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Terkirim</div>
          <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Dikonfirmasi</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.confirmed}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Nilai</div>
          <div className="text-2xl font-bold text-green-600">
            Rp {totalValue.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 font-medium ${
              filter === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Semua ({stats.total})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-6 py-3 font-medium ${
              filter === "draft"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Draft ({stats.draft})
          </button>
          <button
            onClick={() => setFilter("sent")}
            className={`px-6 py-3 font-medium ${
              filter === "sent"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Terkirim ({stats.sent})
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-6 py-3 font-medium ${
              filter === "confirmed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dikonfirmasi ({stats.confirmed})
          </button>
          <button
            onClick={() => setFilter("received")}
            className={`px-6 py-3 font-medium ${
              filter === "received"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Diterima ({stats.received})
          </button>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. PO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Kirim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
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
            {filteredPOs.map((po) => (
              <tr key={po.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{po.supplierName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(po.orderDate).toLocaleDateString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(po.expectedDate).toLocaleDateString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{po.items} item</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Rp {po.totalAmount.toLocaleString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                      po.status
                    )}`}
                  >
                    {getStatusLabel(po.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/purchase-orders/${po.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Detail
                  </Link>
                  {po.status === "draft" && (
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      Kirim
                    </button>
                  )}
                  {po.status === "confirmed" && (
                    <button className="text-green-600 hover:text-green-900 mr-4">
                      Terima
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips Purchase Order</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Buat PO berdasarkan analisis stok minimum untuk menghindari kehabisan barang</li>
          <li>• Konfirmasi tanggal pengiriman dengan supplier sebelum mengirim PO</li>
          <li>• Periksa kualitas dan kuantitas barang saat penerimaan</li>
          <li>• Simpan dokumentasi PO untuk audit dan rekonsiliasi</li>
          <li>• Evaluasi performa supplier secara berkala</li>
        </ul>
      </div>
    </div>
  );
}
