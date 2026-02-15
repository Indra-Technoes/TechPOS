"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    icon: "📊",
    href: "/",
  },
  {
    title: "POS / Kasir",
    icon: "🛒",
    href: "/pos",
  },
  {
    title: "Produk",
    icon: "📦",
    href: "/products",
  },
  {
    title: "Inventaris",
    icon: "📋",
    href: "/inventory",
  },
  {
    title: "Pelanggan",
    icon: "👥",
    href: "/customers",
  },
  {
    title: "Supplier",
    icon: "🏭",
    href: "/suppliers",
  },
  {
    title: "Promosi",
    icon: "🎁",
    href: "/promotions",
  },
  {
    title: "Transaksi",
    icon: "💳",
    href: "/transactions",
  },
  {
    title: "Purchase Order",
    icon: "📝",
    href: "/purchase-orders",
  },
  {
    title: "Pengiriman",
    icon: "🚚",
    href: "/shipments",
  },
  {
    title: "Agen/Reseller",
    icon: "🤝",
    href: "/agents",
  },
  {
    title: "Laporan",
    icon: "📈",
    href: "/reports",
  },
  {
    title: "Analitik AI",
    icon: "🤖",
    href: "/analytics",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">🏪 POS System</h1>
        <p className="text-sm text-gray-400">Warung & Toko</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <span className="text-xl">⚙️</span>
          <span className="text-sm font-medium">Pengaturan</span>
        </Link>
      </div>
    </aside>
  );
}
