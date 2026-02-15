"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewShipmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "incoming",
    poNumber: "",
    orderNumber: "",
    origin: "",
    destination: "",
    shipmentDate: new Date().toISOString().split("T")[0],
    expectedDate: "",
    courier: "",
    trackingNumber: "",
    notes: "",
    status: "pending",
  });

  const suppliers = [
    { id: 1, name: "PT Sumber Makmur, Jakarta" },
    { id: 2, name: "CV Berkah Jaya, Surabaya" },
    { id: 3, name: "UD Maju Bersama, Semarang" },
  ];

  const couriers = [
    "JNE",
    "J&T",
    "SiCepat",
    "Anteraja",
    "Pos Indonesia",
    "GrabExpress",
    "GoSend",
    "Lainnya",
  ];

  const customers = [
    { id: 1, name: "Pelanggan - Jakarta Selatan" },
    { id: 2, name: "Pelanggan - Surabaya" },
    { id: 3, name: "Agen - Bekasi" },
    { id: 4, name: "Toko Kamaratih" },
  ];

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      poNumber: type === "incoming" ? formData.poNumber : "",
      orderNumber: type === "outgoing" ? formData.orderNumber : "",
      origin: type === "outgoing" ? "Toko Anda, Bandung" : "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send data to API
    alert("Pengiriman berhasil dibuat!");
    router.push("/shipments");
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/shipments"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Kembali
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Buat Pengiriman Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipment Type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Jenis Pengiriman</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="incoming"
                  checked={formData.type === "incoming"}
                  onChange={() => handleTypeChange("incoming")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium">Barang Masuk (Dari Supplier)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="outgoing"
                  checked={formData.type === "outgoing"}
                  onChange={() => handleTypeChange("outgoing")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium">Barang Keluar (Ke Pelanggan/Agen)</span>
              </label>
            </div>
          </div>

          {/* Reference Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {formData.type === "incoming" ? "Referensi Pesanan" : "Referensi Order"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.type === "incoming" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Purchase Order
                  </label>
                  <select
                    value={formData.poNumber}
                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih PO</option>
                    <option value="PO-2024-001">PO-2024-001</option>
                    <option value="PO-2024-002">PO-2024-002</option>
                    <option value="PO-2024-003">PO-2024-003</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Order
                  </label>
                  <select
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Order</option>
                    <option value="ORD-2024-050">ORD-2024-050</option>
                    <option value="ORD-2024-049">ORD-2024-049</option>
                    <option value="ORD-2024-048">ORD-2024-048</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Route Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rute Pengiriman</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asal Pengiriman *
                </label>
                {formData.type === "outgoing" ? (
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Toko Anda, Bandung"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tujuan Pengiriman *
                </label>
                {formData.type === "incoming" ? (
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Toko Anda, Bandung"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Pelanggan/Agen</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.name}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Date & Courier Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Jadwal & Kurir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Kirim *
                </label>
                <input
                  type="date"
                  value={formData.shipmentDate}
                  onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Diharapkan *
                </label>
                <input
                  type="date"
                  value={}
                  onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kurir
                </label>
                <select
                  value={formData.courier}
                  onChange={(e) => setFormData({ ...formData, courier: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Kurir</option>
                  {couriers.map((courier) => (
                    <option key={courier} value={courier}>
                      {courier}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Resi
                </label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  placeholder="Masukkan nomor resi..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Awal
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Menunggu</option>
                  <option value="in_transit">Dalam Perjalanan</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Tambahkan catatan jika diperlukan..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/shipments"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Simpan Pengiriman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
