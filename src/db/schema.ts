import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ============================================
// MODUL REGISTRASI & AUTHENTICATION
// ============================================

// Tabel Users (Pemilik, Staff, dll)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("staff"), // owner, staff, admin
  phone: text("phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Customers (Pelanggan/Toko)
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  type: text("type").notNull().default("retail"), // retail, wholesale, b2b
  loyaltyPoints: integer("loyalty_points").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Suppliers
export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address"),
  category: text("category").notNull(), // food, sembako, pakaian, peralatan_rumah_tangga, kerajinan
  paymentTerms: text("payment_terms"), // COD, 7 days, 14 days, 30 days
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// MODUL INVENTARIS
// ============================================

// Tabel Categories
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Products
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  purchasePrice: real("purchase_price").notNull(),
  sellingPrice: real("selling_price").notNull(),
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").default(10), // untuk alert stok menipis
  unit: text("unit").notNull().default("pcs"), // pcs, kg, liter, box, dll
  barcode: text("barcode"),
  image: text("image"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Stock History (untuk tracking perubahan stok)
export const stockHistory = sqliteTable("stock_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id),
  type: text("type").notNull(), // in, out, adjustment
  quantity: integer("quantity").notNull(),
  note: text("note"),
  userId: integer("user_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// MODUL PROMOSI
// ============================================

// Tabel Promotions
export const promotions = sqliteTable("promotions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(), // percentage_discount, nominal_discount, buy_x_get_y, bundle
  value: real("value"), // untuk percentage atau nominal
  buyQuantity: integer("buy_quantity"), // untuk buy x get y
  getQuantity: integer("get_quantity"), // untuk buy x get y
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Promotion Products (produk yang termasuk dalam promosi)
export const promotionProducts = sqliteTable("promotion_products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  promotionId: integer("promotion_id").notNull().references(() => promotions.id),
  productId: integer("product_id").notNull().references(() => products.id),
  isFreeItem: integer("is_free_item", { mode: "boolean" }).default(false), // untuk buy x get y
});

// ============================================
// MODUL POS & TRANSAKSI
// ============================================

// Tabel Transactions (Penjualan)
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  userId: integer("user_id").notNull().references(() => users.id), // kasir
  subtotal: real("subtotal").notNull(),
  discount: real("discount").default(0),
  tax: real("tax").default(0),
  total: real("total").notNull(),
  paymentMethod: text("payment_method").notNull(), // cash, qris, transfer
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed
  paymentReference: text("payment_reference"), // untuk QRIS/Transfer
  cashReceived: real("cash_received"), // untuk pembayaran tunai
  cashChange: real("cash_change"), // untuk pembayaran tunai
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Transaction Items (Detail item dalam transaksi)
export const transactionItems = sqliteTable("transaction_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  transactionId: integer("transaction_id").notNull().references(() => transactions.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(), // harga saat transaksi
  discount: real("discount").default(0),
  subtotal: real("subtotal").notNull(),
  promotionId: integer("promotion_id").references(() => promotions.id),
});

// ============================================
// MODUL MANAJEMEN BISNIS - PURCHASE ORDERS
// ============================================

// Tabel Purchase Orders (Order ke Supplier)
export const purchaseOrders = sqliteTable("purchase_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  poNumber: text("po_number").notNull().unique(),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  userId: integer("user_id").notNull().references(() => users.id),
  orderDate: integer("order_date", { mode: "timestamp" }).notNull(),
  expectedDate: integer("expected_date", { mode: "timestamp" }),
  status: text("status").notNull().default("pending"), // pending, approved, received, cancelled
  subtotal: real("subtotal").notNull(),
  tax: real("tax").default(0),
  total: real("total").notNull(),
  paymentMethod: text("payment_method"), // qris, transfer
  paymentStatus: text("payment_status").default("unpaid"), // unpaid, paid
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Purchase Order Items
export const purchaseOrderItems = sqliteTable("purchase_order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseOrderId: integer("purchase_order_id").notNull().references(() => purchaseOrders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  subtotal: real("subtotal").notNull(),
  receivedQuantity: integer("received_quantity").default(0),
});

// ============================================
// MODUL RANTAI PASOK - SHIPMENTS
// ============================================

// Tabel Shipments (Pengiriman)
export const shipments = sqliteTable("shipments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trackingNumber: text("tracking_number").notNull().unique(),
  purchaseOrderId: integer("purchase_order_id").references(() => purchaseOrders.id),
  transactionId: integer("transaction_id").references(() => transactions.id), // untuk B2B
  type: text("type").notNull(), // inbound (dari supplier), outbound (ke customer)
  status: text("status").notNull().default("pending"), // pending, in_transit, delivered, cancelled
  shippingAddress: text("shipping_address").notNull(),
  courier: text("courier"), // JNE, JNT, SiCepat, dll
  estimatedDelivery: integer("estimated_delivery", { mode: "timestamp" }),
  actualDelivery: integer("actual_delivery", { mode: "timestamp" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Shipment Tracking (untuk tracking history)
export const shipmentTracking = sqliteTable("shipment_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  shipmentId: integer("shipment_id").notNull().references(() => shipments.id),
  status: text("status").notNull(),
  location: text("location"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// MODUL ANALITIK & LAPORAN
// ============================================

// Tabel untuk menyimpan snapshot laporan harian
export const dailyReports = sqliteTable("daily_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reportDate: integer("report_date", { mode: "timestamp" }).notNull(),
  totalSales: real("total_sales").notNull(),
  totalTransactions: integer("total_transactions").notNull(),
  totalProfit: real("total_profit").notNull(),
  totalCost: real("total_cost").notNull(),
  cashSales: real("cash_sales").default(0),
  qrisSales: real("qris_sales").default(0),
  transferSales: real("transfer_sales").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel untuk AI predictions/recommendations
export const aiRecommendations = sqliteTable("ai_recommendations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // stock_alert, reorder_suggestion, sales_forecast
  productId: integer("product_id").references(() => products.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").default("medium"), // low, medium, high
  status: text("status").default("pending"), // pending, reviewed, applied, dismissed
  data: text("data"), // JSON data untuk detail rekomendasi
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// MODUL B2B KEAGENAN
// ============================================

// Tabel Agents (Agen/Reseller)
export const agents = sqliteTable("agents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  type: text("type").notNull().default("agent"), // agent, reseller
  level: text("level"), // Platinum, Gold, Silver, Bronze
  commissionRate: real("commission_rate").default(5), // persentase komisi
  status: text("status").default("active"), // active, inactive, suspended
  joinDate: integer("join_date", { mode: "timestamp" }),
  totalOrders: integer("total_orders").default(0),
  totalRevenue: real("total_revenue").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Tabel Agent Commissions
export const agentCommissions = sqliteTable("agent_commissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  transactionId: integer("transaction_id").notNull().references(() => transactions.id),
  amount: real("amount").notNull(),
  status: text("status").default("pending"), // pending, paid
  paidAt: integer("paid_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
