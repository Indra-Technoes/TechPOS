"use client";

import { useState } from "react";
import Link from "next/link";

interface Promotion {
  id: number;
  name: string;
  type: "discount" | "buy_x_get_y" | "bundle";
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired";
  minPurchase?: number;
  applicableProducts?: string[];
}

export default function PromotionsPage() {
  const [promotions] = useState<Promotion[]>([
    {
      id: 1,
      name: "Diskon Akhir Tahun 20%",
      type: "discount",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      status: "active",
      minPurchase: 100000,
    },
    {
      id: 2,
      name: "Beli 2 Gratis 1",
      type: "buy_x_get_y",
      startDate: "2024-12-15",
      endDate: "2025-01-15",
      status: "active",
    },
    {
      id: 3,
      name: "Bundle Hemat Ramadan",
      type: "bundle",
      discountType: "fixed",
      discountValue: 50000,
      startDate: "2025-03-01",
      endDate: "2025-04-01",
      status: "scheduled",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
    };
    const labels = {
      active: "Aktif",
      scheduled: "Terjadwal",
      expired: "Berakhir",
    };
    return {
      class: badges[status as keyof typeof badges],
      label: labels[status as keyof typeof labels],
    };
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      discount: "Diskon",
      buy_x_get_y: "Beli X Gratis Y",
      bundle: "Paket Bundle",
    };
    return labels[type as keyof typeof labels];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const activeCount = promotions.filter((p) => p.status === "active").length;
  const scheduledCount = promotions.filter(
    (p) => p.status === "scheduled"
  ).length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promosi</h1>
          <p className="text-gray-600 mt-1">
            Kelola promosi dan diskon untuk pelanggan
          </p>
        </div>
        <Link
          href="/promotions/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Buat Promosi Baru
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Promosi</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {promotions.length}
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow border border-green-200">
          <div className="text-sm text-green-800">Promosi Aktif</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {activeCount}
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200">
          <div className="text-sm text-blue-800">Terjadwal</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {scheduledCount}
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Promosi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diskon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Pembelian
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
              {promotions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Belum ada promosi. Klik "Buat Promosi Baru" untuk memulai.
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => {
                  const status = getStatusBadge(promo.status);
                  return (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {promo.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getTypeLabel(promo.type)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {promo.discountValue ? (
                          <div className="text-sm font-semibold text-green-600">
                            {promo.discountType === "percentage"
                              ? `${promo.discountValue}%`
                              : `Rp ${promo.discountValue.toLocaleString(
                                  "id-ID"
                                )}`}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(promo.startDate)} -{" "}
                          {formatDate(promo.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {promo.minPurchase ? (
                          <div className="text-sm text-gray-500">
                            Rp {promo.minPurchase.toLocaleString("id-ID")}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">
                            Tidak ada
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/promotions/${promo.id}`}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </Link>
                        <button className="text-red-600 hover:text-red-800">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Tips Promosi Efektif
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Buat promosi dengan periode terbatas untuk urgency</li>
                <li>Gunakan minimum pembelian untuk meningkatkan nilai transaksi</li>
                <li>Kombinasikan promosi dengan produk slow-moving</li>
                <li>Monitor performa promosi melalui menu Analitik</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
