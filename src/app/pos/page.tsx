"use client";

import { useState, useEffect } from "react";

type Product = {
  id: number;
  sku: string;
  name: string;
  sellingPrice: number;
  stock: number;
  unit: string;
  categoryId: number | null;
};

type CartItem = Product & {
  quantity: number;
  subtotal: number;
  discount: number;
};

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "transfer">("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [loading, setLoading] = useState(false);

  // Load products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.sellingPrice,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          subtotal: product.sellingPrice,
          discount: 0,
        },
      ]);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.sellingPrice - item.discount,
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = cart.reduce((sum, item) => sum + item.discount, 0);
    return subtotal - discount;
  };

  const calculateChange = () => {
    if (paymentMethod !== "cash") return 0;
    const total = calculateTotal();
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - total);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    if (paymentMethod === "cash") {
      const total = calculateTotal();
      const received = parseFloat(cashReceived) || 0;
      if (received < total) {
        alert("Uang yang diterima kurang!");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          paymentMethod,
          cashReceived: paymentMethod === "cash" ? parseFloat(cashReceived) : null,
          cashChange: paymentMethod === "cash" ? calculateChange() : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Transaksi berhasil! Invoice: ${data.invoiceNumber}`);
        setCart([]);
        setCashReceived("");
        fetchProducts(); // Refresh products untuk update stok
      } else {
        alert("Transaksi gagal!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Side - Products */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🛒 Kasir POS
          </h2>
          <input
            type="text"
            placeholder="Cari produk (nama atau SKU)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`p-4 border rounded-lg text-left transition-all ${
                  product.stock <= 0
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-50"
                    : "bg-white border-gray-200 hover:border-blue-500 hover:shadow-md"
                }`}
              >
                <p className="font-semibold text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{product.sku}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  Rp {product.sellingPrice.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Stok: {product.stock} {product.unit}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Keranjang Belanja
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Keranjang masih kosong
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Rp {item.sellingPrice.toLocaleString("id-ID")} / {item.unit}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 0)
                    }
                    className="w-16 text-center border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <p className="ml-auto font-semibold text-gray-900">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-200 space-y-4">
          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`py-2 px-3 rounded-lg border text-sm font-medium ${
                  paymentMethod === "cash"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                💵 Tunai
              </button>
              <button
                onClick={() => setPaymentMethod("qris")}
                className={`py-2 px-3 rounded-lg border text-sm font-medium ${
                  paymentMethod === "qris"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                📱 QRIS
              </button>
              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`py-2 px-3 rounded-lg border text-sm font-medium ${
                  paymentMethod === "transfer"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                🏦 Transfer
              </button>
            </div>
          </div>

          {/* Cash Input */}
          {paymentMethod === "cash" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uang Diterima
              </label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {cashReceived && (
                <p className="text-sm text-gray-600 mt-2">
                  Kembalian: Rp {calculateChange().toLocaleString("id-ID")}
                </p>
              )}
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                Rp {calculateTotal().toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
