"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

export default function StaffPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kasir/staff ini?")) return;

    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Kasir/staff berhasil dihapus!");
        fetchUsers();
      } else {
        alert("Gagal menghapus kasir/staff");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus kasir/staff");
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      owner: { color: "bg-purple-100 text-purple-800", label: "Pemilik" },
      admin: { color: "bg-blue-100 text-blue-800", label: "Admin" },
      staff: { color: "bg-green-100 text-green-800", label: "Kasir" },
    };
    const badge = badges[role] || badges.staff;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👤 Kasir & Staff</h1>
          <p className="text-gray-600 mt-1">Kelola akun kasir dan staff toko</p>
        </div>
        <Link
          href="/staff/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          + Tambah Kasir/Staff
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Belum Ada Kasir/Staff
          </h3>
          <p className="text-gray-600 mb-6">
            Tambahkan kasir atau staff untuk mengelola toko Anda
          </p>
          <Link
            href="/staff/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Tambah Kasir/Staff Pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terdaftar
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {user.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informasi Role:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Pemilik</strong>: Akses penuh ke semua fitur</li>
          <li>• <strong>Admin</strong>: Dapat mengelola produk, laporan, dan pengaturan</li>
          <li>• <strong>Kasir</strong>: Hanya dapat melakukan transaksi penjualan</li>
        </ul>
      </div>
    </div>
  );
}
