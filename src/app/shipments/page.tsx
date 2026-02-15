"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Shipment {
  id: number;
  shipmentNumber: string;
  type: "incoming" | "outgoing";
  poNumber?: string;
  orderNumber?: string;
  origin: string;
  destination: string;
  shipmentDate: string;
  expectedDate: string;
  actualDate?: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  items: number;
  courier?: string;
  trackingNumber?: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    // Sample data - replace with actual API call
    const sampleShipments: Shipment[] = [
      {
        id: 1,
        shipmentNumber: "SHP-IN-001",
        type: "incoming",
        poNumber: "PO-2024-001",
        origin: "PT Sumber Makmur, Jakarta",
        destination: "Toko Anda, Bandung",
        shipmentDate: "2024-01-20",
        expectedDate: "2024-01-22",
        status: "in_transit",
        items: 25,
        courier: "JNE Cargo",
        trackingNumber: "JNE123456789",
      },
      {
        id: 2,
        shipmentNumber: "SHP-OUT-001",
        type: "outgoing",
        orderNumber: "ORD-2024-050",
        origin: "Toko Anda, Bandung",
        destination: "Pelanggan - Jakarta Selatan",
        shipmentDate: "2024-01-21",
        expectedDate: "2024-01-23",
        status: "pending",
        items: 5,
        courier: "SiCepat",
        trackingNumber: "SC987654321",
      },
      {
        id: 3,
        shipmentNumber: "SHP-IN-002",
        type: "incoming",
        poNumber: "PO-2024-002",
        origin: "CV Berkah Jaya, Surabaya",
        destination: "Toko Anda, Bandung",
        shipmentDate: "2024-01-18",
        expectedDate: "2024-01-20",
        actualDate: "2024-01-20",
        status: "delivered",
        items: 15,
        courier: "J&T Cargo",
        trackingNumber: "JT456789123",
      },
      {
        id: 4,
        shipmentNumber: "SHP-OUT-002",
        type: "outgoing",
        orderNumber: "ORD-2024-048",
        origin: "Toko Anda, Bandung",
        destination: "Agen - Bekasi",
        shipmentDate: "2024-01-19",
        expectedDate: "2024-01-21",
        actualDate: "2024-01-21",
        status: "delivered",
        items: 30,
        courier: "Anteraja",
        trackingNumber: "ANT789456123",
      },
    ];
    setShipments(sampleShipments);
  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      in_transit: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Menunggu",
      in_transit: "Dalam Perjalanan",
      delivered: "Terkirim",
      cancelled: "Dibatalkan",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeLabel = (type: string) => {
    return type === "incoming" ? "Masuk" : "Keluar";
  };

  const getTypeBadge = (type: string) => {
    return type === "incoming"
      ? "bg-purple-100 text-purple-800"
      : "bg-orange-100 text-orange-800";
  };

  const filteredShipments = shipments.filter((shipment) => {
    const statusMatch = filter === "all" || shipment.status === filter;
    const typeMatch = typeFilter === "all" || shipment.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const stats = {
    total: shipments.length,
    incoming: shipments.filter((s) => s.type === "incoming").length,
    outgoing: shipments.filter((s) => s.type === "outgoing").length,
    pending: shipments.filter((s) => s.status === "pending").length,
    in_transit: shipments.filter((s) => s.status === "in_transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengiriman</h1>
          <p className="text-gray-600 mt-1">Kelola pengiriman barang masuk dan keluar</p>
        </div>
        <Link
          href="/shipments/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Buat Pengiriman
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Barang Masuk</div>
          <div className="text-2xl font-bold text-purple-600">{stats.incoming}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Barang Keluar</div>
          <div className="text-2xl font-bold text-orange-600">{stats.outgoing}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Menunggu</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Dalam Perjalanan</div>
          <div className="text-2xl font-bold text-blue-600">{stats.in_transit}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Terkirim</div>
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua</option>
              <option value="incoming">Barang Masuk</option>
              <option value="outgoing">Barang Keluar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="in_transit">Dalam Perjalanan</option>
              <option value="delivered">Terkirim</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Pengiriman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tujuan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kurir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Kirim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
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
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {shipment.shipmentNumber}
                  </div>
                  {shipment.trackingNumber && (
                    <div className="text-xs text-gray-500">{shipment.trackingNumber}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(
                      shipment.type
                    )}`}
                  >
                    {getTypeLabel(shipment.type)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{shipment.origin}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{shipment.destination}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{shipment.courier || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(shipment.shipmentDate).toLocaleDateString("id-ID")}
                  </div>
                  <div className="text-xs text-gray-500">
                    Est: {new Date(shipment.expectedDate).toLocaleDateString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{shipment.items} item</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                      shipment.status
                    )}`}
                  >
                    {getStatusLabel(shipment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/shipments/${shipment.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Detail
                  </Link>
                  {shipment.status === "in_transit" && (
                    <button className="text-green-600 hover:text-green-900">Terima</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips Manajemen Pengiriman</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Selalu catat nomor resi untuk tracking pengiriman</li>
          <li>• Periksa kondisi barang saat penerimaan dan dokumentasikan jika ada kerusakan</li>
          <li>• Koordinasi dengan kurir untuk jadwal pengiriman yang tepat</li>
          <li>• Gunakan packaging yang aman untuk menghindari kerusakan barang</li>
          <li>• Update status pengiriman secara real-time untuk transparansi</li>
        </ul>
      </div>
    </div>
  );
}
