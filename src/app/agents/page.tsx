"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Agent {
  id: number;
  code: string;
  name: string;
  type: "agent" | "reseller";
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  joinDate?: string | null;
  status: "active" | "inactive" | "suspended";
  totalOrders?: number;
  totalRevenue?: number;
  commissionRate?: number;
  level?: string | null;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
      } else {
        // Fallback to sample data if API fails
        setAgents(sampleAgents);
      }
    } catch {
      // Fallback to sample data
      setAgents(sampleAgents);
    }
  };

  // Sample data for fallback
  const sampleAgents: Agent[] = [
    {
        id: 1,
        code: "AGT-001",
        name: "Budi Santoso",
        type: "agent",
        phone: "081234567890",
        email: "budi@example.com",
        address: "Jl. Merdeka No. 123",
        city: "Jakarta",
        joinDate: "2023-06-15",
        status: "active",
        totalOrders: 45,
        totalRevenue: 125000000,
        commissionRate: 5,
        level: "Gold",
      },
      {
        id: 2,
        code: "RSL-001",
        name: "Siti Nurhaliza",
        type: "reseller",
        phone: "082345678901",
        email: "siti@example.com",
        address: "Jl. Sudirman No. 456",
        city: "Bandung",
        joinDate: "2023-08-20",
        status: "active",
        totalOrders: 28,
        totalRevenue: 65000000,
        commissionRate: 10,
        level: "Silver",
      },
      {
        id: 3,
        code: "AGT-002",
        name: "Ahmad Wijaya",
        type: "agent",
        phone: "083456789012",
        email: "ahmad@example.com",
        address: "Jl. Gatot Subroto No. 789",
        city: "Surabaya",
        joinDate: "2023-09-10",
        status: "active",
        totalOrders: 32,
        totalRevenue: 89000000,
        commissionRate: 5,
        level: "Silver",
      },
      {
        id: 4,
        code: "RSL-002",
        name: "Dewi Lestari",
        type: "reseller",
        phone: "084567890123",
        email: "dewi@example.com",
        address: "Jl. Ahmad Yani No. 321",
        city: "Semarang",
        joinDate: "2023-10-05",
        status: "inactive",
        totalOrders: 12,
        totalRevenue: 28000000,
        commissionRate: 10,
        level: "Bronze",
      },
      {
        id: 5,
        code: "AGT-003",
        name: "Rudi Hartono",
        type: "agent",
        phone: "085678901234",
        email: "rudi@example.com",
        address: "Jl. Diponegoro No. 654",
        city: "Yogyakarta",
        joinDate: "2023-07-25",
        status: "active",
        totalOrders: 58,
        totalRevenue: 156000000,
        commissionRate: 5,
        level: "Platinum",
      },
    ];
    setAgents(sampleAgents);
  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: "Aktif",
      inactive: "Tidak Aktif",
      suspended: "Ditangguhkan",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeLabel = (type: string) => {
    return type === "agent" ? "Agen" : "Reseller";
  };

  const getTypeBadge = (type: string) => {
    return type === "agent"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const getLevelBadge = (level?: string) => {
    const badges = {
      Platinum: "bg-gray-800 text-white",
      Gold: "bg-yellow-500 text-white",
      Silver: "bg-gray-400 text-white",
      Bronze: "bg-orange-700 text-white",
    };
    return badges[level as keyof typeof badges] || "bg-gray-200 text-gray-800";
  };

  const filteredAgents = agents.filter((agent) => {
    const statusMatch = filter === "all" || agent.status === filter;
    const typeMatch = typeFilter === "all" || agent.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const stats = {
    total: agents.length,
    agents: agents.filter((a) => a.type === "agent").length,
    resellers: agents.filter((a) => a.type === "reseller").length,
    active: agents.filter((a) => a.status === "active").length,
    totalRevenue: agents.reduce((sum, a) => sum + a.totalRevenue, 0),
    totalOrders: agents.reduce((sum, a) => sum + a.totalOrders, 0),
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agen & Reseller</h1>
          <p className="text-gray-600 mt-1">Kelola jaringan distribusi dan mitra bisnis</p>
        </div>
        <Link
          href="/agents/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Tambah Agen/Reseller
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Mitra</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">{stats.active} aktif</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Agen</div>
          <div className="text-2xl font-bold text-blue-600">{stats.agents}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Reseller</div>
          <div className="text-2xl font-bold text-purple-600">{stats.resellers}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Order</div>
          <div className="text-2xl font-bold text-orange-600">{stats.totalOrders}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            Rp {(stats.totalRevenue / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua</option>
              <option value="agent">Agen</option>
              <option value="reseller">Reseller</option>
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
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="suspended">Ditangguhkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontak
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kota
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Komisi
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
            {filteredAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{agent.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                  <div className="text-xs text-gray-500">
                    Bergabung: {new Date(agent.joinDate).toLocaleDateString("id-ID")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(
                      agent.type
                    )}`}
                  >
                    {getTypeLabel(agent.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {agent.level && (
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelBadge(
                        agent.level
                      )}`}
                    >
                      {agent.level}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{agent.phone}</div>
                  <div className="text-xs text-gray-500">{agent.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{agent.city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{agent.totalOrders}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Rp {(agent.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{agent.commissionRate}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                      agent.status
                    )}`}
                  >
                    {getStatusLabel(agent.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/agents/${agent.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/agents/${agent.id}/orders`}
                    className="text-green-600 hover:text-green-900"
                  >
                    Order
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Level Information */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Level Keanggotaan</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full">
                  Platinum
                </span>
                <span className="text-sm text-gray-600">≥ Rp 150M / tahun</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Komisi 7%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                  Gold
                </span>
                <span className="text-sm text-gray-600">≥ Rp 100M / tahun</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Komisi 6%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
                  Silver
                </span>
                <span className="text-sm text-gray-600">≥ Rp 50M / tahun</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Komisi 5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-orange-700 text-white text-xs font-semibold rounded-full">
                  Bronze
                </span>
                <span className="text-sm text-gray-600">&lt; Rp 50M / tahun</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Komisi 4%</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips Manajemen Agen</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Berikan training produk secara berkala untuk meningkatkan penjualan</li>
            <li>• Monitor performa agen dan berikan reward untuk top performer</li>
            <li>• Sediakan material marketing untuk mendukung promosi</li>
            <li>• Buat program insentif untuk mencapai target penjualan</li>
            <li>• Komunikasi rutin untuk memahami kebutuhan dan kendala agen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
