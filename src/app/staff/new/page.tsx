"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "staff",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          role: formData.role,
        }),
      });

      if (response.ok) {
        alert("Kasir/staff berhasil ditambahkan!");
        router.push("/staff");
      } else {
        const error = await response.json();
        alert(error.error || "Gagal menambahkan kasir/staff");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Terjadi kesalahan saat menambahkan kasir/staff");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/staff"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Kembali ke Daftar Kasir/Staff
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👤 Tambah Kasir/Staff Baru
          </h1>
          <p className="text-gray-600 mb-6">
            Buat akun baru untuk kasir atau staff toko
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contoh@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email akan digunakan untuk login
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimal 6 karakter"
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ketik ulang password"
              />
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="08123456789"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role/Jabatan <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="staff">Kasir</option>
                <option value="admin">Admin</option>
                <option value="owner">Pemilik</option>
              </select>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>• <strong>Kasir</strong>: Hanya dapat melakukan transaksi penjualan</p>
                <p>• <strong>Admin</strong>: Dapat mengelola produk, laporan, dan pengaturan</p>
                <p>• <strong>Pemilik</strong>: Akses penuh ke semua fitur</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Menyimpan..." : "💾 Simpan Kasir/Staff"}
              </button>
              <Link
                href="/staff"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Penting:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Pastikan email yang digunakan unik dan belum terdaftar</li>
            <li>• Password minimal 6 karakter untuk keamanan</li>
            <li>• Simpan informasi login dengan aman</li>
            <li>• Kasir dapat login menggunakan email dan password ini</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
