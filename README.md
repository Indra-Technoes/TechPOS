# 🏪 Aplikasi Point of Sales (POS) - Warung & Toko

Aplikasi POS lengkap yang dibangun dengan Next.js 16, TypeScript, dan Tailwind CSS 4 untuk membantu mengelola bisnis warung dan toko Anda.

## ✨ Fitur Utama

### ✅ Sudah Diimplementasikan

#### 1. **Dashboard**
- Statistik real-time (Total Produk, Transaksi, Pelanggan, Supplier)
- Transaksi terbaru
- Alert stok menipis
- Aksi cepat (Buka Kasir, Tambah Produk, Order Barang, Lihat Laporan)

#### 2. **Modul POS / Kasir** 🛒
- Interface kasir yang user-friendly
- Pencarian produk cepat (nama/SKU)
- Keranjang belanja dengan update quantity
- 3 Metode pembayaran:
  - 💵 Tunai (dengan perhitungan kembalian otomatis)
  - 📱 QRIS
  - 🏦 Transfer/VA
- Update stok otomatis setelah transaksi
- Generate invoice number otomatis

#### 3. **Manajemen Produk** 📦
- Daftar semua produk dengan filter
- Tambah produk baru dengan form lengkap
- Tracking stok real-time
- Alert stok menipis/habis
- Support berbagai satuan (pcs, kg, liter, box, dll)
- Barcode support
- Kategori produk
- Harga beli & harga jual

#### 4. **Modul Registrasi**
- **Registrasi Pelanggan** 👥
  - Tipe: Retail, Grosir, B2B
  - Sistem poin loyalitas
  - Data kontak lengkap
  
- **Registrasi Supplier** 🏭
  - 5 Kategori: Makanan, Sembako, Pakaian, Peralatan RT, Kerajinan
  - Termin pembayaran (COD, 7/14/30/45 hari)
  - Data kontak dan alamat

#### 5. **Riwayat Transaksi** 💳
- Daftar semua transaksi penjualan
- Filter berdasarkan status pembayaran
- Detail metode pembayaran
- Total penjualan dan statistik
- Invoice tracking

#### 6. **Laporan Bisnis** 📈
- **Laporan Akuntansi**
  - Total Pendapatan
  - Total Biaya
  - Laba Bersih & Margin
  
- **Laporan Stok**
  - Total produk
  - Stok aman/menipis/habis
  - Rekomendasi restock
  
- **Laporan Pembayaran**
  - Breakdown per metode (Tunai, QRIS, Transfer)
  - Jumlah transaksi per metode

#### 7. **Analitik AI** 🤖
- Prediksi penjualan bulan depan
- Identifikasi produk terlaris
- Alert stok menipis otomatis
- Saran pemesanan ulang
- Prediksi tren penjualan
- Tips optimasi bisnis
- Metrik performa (Perputaran stok, Rata-rata transaksi, Efisiensi stok)

## 🗄️ Database Schema

Aplikasi ini menggunakan **18 tabel database** yang mencakup:

1. **users** - Akun pemilik dan staff
2. **customers** - Data pelanggan/toko
3. **suppliers** - Data supplier
4. **categories** - Kategori produk
5. **products** - Master produk
6. **stock_history** - Riwayat perubahan stok
7. **promotions** - Data promosi
8. **promotion_products** - Produk dalam promosi
9. **transactions** - Transaksi penjualan
10. **transaction_items** - Detail item transaksi
11. **purchase_orders** - Order ke supplier
12. **purchase_order_items** - Detail PO
13. **shipments** - Data pengiriman
14. **shipment_tracking** - Tracking pengiriman
15. **daily_reports** - Snapshot laporan harian
16. **ai_recommendations** - Rekomendasi AI
17. **agents** - Data agen/reseller
18. **agent_commissions** - Komisi agen

## 🚀 Teknologi

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite dengan Drizzle ORM
- **Package Manager**: Bun

## 📋 Modul yang Siap Dikembangkan

Struktur database sudah mendukung modul-modul berikut yang siap untuk diimplementasikan:

- ✅ Modul Promosi (Diskon %, Nominal, Buy X Get Y, Bundling)
- ✅ Modul Purchase Orders (Order ke Supplier)
- ✅ Modul Pengiriman & Tracking
- ✅ Modul Agen/Reseller B2B
- ✅ Modul Inventaris lengkap

## 🎯 Cara Menggunakan

### 1. Install Dependencies
```bash
bun install
```

### 2. Generate Database Migrations
```bash
bun db:generate
```

### 3. Run Development Server
```bash
bun dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### 4. Mulai Menggunakan

1. **Tambah Produk** - Buka menu "Produk" → "Tambah Produk"
2. **Registrasi Pelanggan** - Buka menu "Pelanggan" → "Tambah Pelanggan"
3. **Registrasi Supplier** - Buka menu "Supplier" → "Tambah Supplier"
4. **Buka Kasir** - Klik "POS / Kasir" untuk mulai transaksi
5. **Lihat Laporan** - Akses menu "Laporan" untuk melihat performa bisnis
6. **Cek Analitik AI** - Menu "Analitik AI" untuk rekomendasi cerdas

## 📱 Fitur Unggulan

### Sistem Pembayaran Lengkap
- **Tunai**: Perhitungan kembalian otomatis
- **QRIS**: Siap integrasi dengan payment gateway
- **Transfer/VA**: Support untuk pembayaran non-tunai

### Manajemen Stok Cerdas
- Alert otomatis saat stok menipis
- Tracking riwayat perubahan stok
- Rekomendasi restock dari AI

### Laporan Komprehensif
- Laporan akuntansi (Pendapatan, Biaya, Laba)
- Laporan stok penjualan
- Breakdown metode pembayaran
- Export ke PDF/Excel (siap dikembangkan)

### AI-Powered Analytics
- Prediksi penjualan
- Identifikasi produk terlaris
- Saran optimasi bisnis
- Metrik performa real-time

## 🔐 Keamanan

Database credentials (`DB_URL`, `DB_TOKEN`) disediakan otomatis oleh sandbox environment.

## 📝 Catatan Pengembangan

- Semua komponen menggunakan Server Components by default untuk performa optimal
- Client Components (`"use client"`) hanya digunakan untuk interaktivitas
- TypeScript strict mode untuk type safety
- ESLint configured untuk code quality

## 🎨 UI/UX

- Design modern dengan Tailwind CSS 4
- Responsive untuk desktop dan mobile
- Sidebar navigation yang intuitif
- Color-coded status dan alerts
- Emoji icons untuk visual appeal

## 📊 Statistik Proyek

- **Total Files**: 30+ files
- **Database Tables**: 18 tables
- **API Routes**: 4 routes (Products, Transactions, Customers, Suppliers)
- **Pages**: 10+ pages
- **Components**: Sidebar, Header, dan form components

## 🚧 Roadmap

Modul yang bisa dikembangkan selanjutnya:
- [ ] Modul Promosi UI
- [ ] Modul Purchase Orders UI
- [ ] Modul Pengiriman & Tracking UI
- [ ] Modul Agen/Reseller UI
- [ ] Authentication & Authorization
- [ ] Export laporan (PDF/Excel)
- [ ] Print invoice
- [ ] Integrasi payment gateway
- [ ] Mobile app version

## 📄 Lisensi

Aplikasi ini dibuat untuk keperluan bisnis warung dan toko.

---

**Dibuat dengan ❤️ menggunakan Next.js, TypeScript, dan Tailwind CSS**
