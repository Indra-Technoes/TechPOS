// POS System - Kilo Code
// Product Database
const products = [
    // Food
    { id: 1, name: 'Pizza', price: 12.99, category: 'food', icon: '🍕', stock: 25 },
    { id: 2, name: 'Burger', price: 8.99, category: 'food', icon: '🍔', stock: 30 },
    { id: 3, name: 'Sandwich', price: 6.99, category: 'food', icon: '🥪', stock: 20 },
    { id: 4, name: 'Hot Dog', price: 5.99, category: 'food', icon: '🌭', stock: 15 },
    { id: 5, name: 'Taco', price: 7.99, category: 'food', icon: '🌮', stock: 18 },
    { id: 6, name: 'Sushi', price: 15.99, category: 'food', icon: '🍣', stock: 12 },
    
    // Drinks
    { id: 7, name: 'Coffee', price: 3.99, category: 'drinks', icon: '☕', stock: 50 },
    { id: 8, name: 'Soda', price: 2.49, category: 'drinks', icon: '🥤', stock: 60 },
    { id: 9, name: 'Beer', price: 5.99, category: 'drinks', icon: '🍺', stock: 40 },
    { id: 10, name: 'Wine', price: 18.99, category: 'drinks', icon: '🍷', stock: 25 },
    { id: 11, name: 'Juice', price: 3.49, category: 'drinks', icon: '🧃', stock: 35 },
    { id: 12, name: 'Water', price: 1.99, category: 'drinks', icon: '💧', stock: 100 },
    
    // Electronics
    { id: 13, name: 'Headphones', price: 79.99, category: 'electronics', icon: '🎧', stock: 15 },
    { id: 14, name: 'Phone', price: 699.99, category: 'electronics', icon: '📱', stock: 8 },
    { id: 15, name: 'Laptop', price: 1299.99, category: 'electronics', icon: '💻', stock: 5 },
    { id: 16, name: 'Watch', price: 299.99, category: 'electronics', icon: '⌚', stock: 12 },
    { id: 17, name: 'Camera', price: 899.99, category: 'electronics', icon: '📷', stock: 6 },
    { id: 18, name: 'Speaker', price: 149.99, category: 'electronics', icon: '🔊', stock: 10 },
    
    // Clothing
    { id: 19, name: 'T-Shirt', price: 19.99, category: 'clothing', icon: '👕', stock: 50 },
    { id: 20, name: 'Jeans', price: 49.99, category: 'clothing', icon: '👖', stock: 30 },
    { id: 21, name: 'Dress', price: 69.99, category: 'clothing', icon: '👗', stock: 20 },
    { id: 22, name: 'Shoes', price: 89.99, category: 'clothing', icon: '👟', stock: 25 },
    { id: 23, name: 'Hat', price: 24.99, category: 'clothing', icon: '🧢', stock: 40 },
    { id: 24, name: 'Jacket', price: 129.99, category: 'clothing', icon: '🧥', stock: 15 }
];

// State Management
let cart = [];
let currentCategory = 'all';
let selectedPaymentMethod = null;
const TAX_RATE = 0.10; // 10% tax

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderProducts();
    setupEventListeners();
    updateCart();
}

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
}

// Event Listeners
function setupEventListeners() {
    // Category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderProducts();
        });
    });

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        renderProducts(e.target.value);
    });

    // Clear cart
    document.getElementById('clear-cart').addEventListener('click', () => {
        if (cart.length > 0 && confirm('Clear all items from cart?')) {
            cart = [];
            updateCart();
        }
    });

    // Payment methods
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            selectedPaymentMethod = e.currentTarget.dataset.method;
            updateCheckoutButton();
        });
    });

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

    // Cash modal
    document.getElementById('cash-received').addEventListener('input', calculateChange);
    document.querySelectorAll('.quick-amount').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amount = parseFloat(e.target.dataset.amount);
            document.getElementById('cash-received').value = amount;
            calculateChange();
        });
    });
    document.getElementById('cancel-cash').addEventListener('click', closeCashModal);
    document.getElementById('confirm-cash').addEventListener('click', completeCashPayment);

    // Receipt modal
    document.getElementById('close-receipt').addEventListener('click', closeReceiptModal);
}

// Render Products
function renderProducts(searchTerm = '') {
    const grid = document.getElementById('products-grid');
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="addToCart(${product.id})">
            <div class="product-icon">${product.icon}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-stock">Stock: ${product.stock}</div>
        </div>
    `).join('');
}

// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert(`Only ${product.stock} items available in stock!`);
            return;
        }
    } else {
        if (product.stock > 0) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                icon: product.icon,
                quantity: 1,
                maxStock: product.stock
            });
        } else {
            alert('Product out of stock!');
            return;
        }
    }
    
    updateCart();
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    const newQuantity = cartItem.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else if (newQuantity <= cartItem.maxStock) {
        cartItem.quantity = newQuantity;
        updateCart();
    } else {
        alert(`Only ${cartItem.maxStock} items available in stock!`);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Cart is empty</p>
                <p class="empty-cart-subtitle">Add items to start a sale</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-icon">${item.icon}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="qty-btn remove-btn" onclick="removeFromCart(${item.id})">×</button>
                </div>
            </div>
        `).join('');
    }
    
    updateSummary();
    updateCheckoutButton();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = cart.length === 0 || !selectedPaymentMethod;
}

// Checkout Process
function handleCheckout() {
    if (cart.length === 0 || !selectedPaymentMethod) return;

    if (selectedPaymentMethod === 'cash') {
        openCashModal();
    } else {
        // For card and mobile payments, process immediately
        processPayment();
    }
}

function openCashModal() {
    const modal = document.getElementById('cash-modal');
    const total = calculateTotal();
    document.getElementById('cash-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cash-received').value = '';
    document.getElementById('change-amount').textContent = '$0.00';
    document.getElementById('confirm-cash').disabled = true;
    modal.classList.add('active');
}

function closeCashModal() {
    document.getElementById('cash-modal').classList.remove('active');
}

function calculateChange() {
    const total = calculateTotal();
    const received = parseFloat(document.getElementById('cash-received').value) || 0;
    const change = received - total;
    
    document.getElementById('change-amount').textContent = `$${Math.max(0, change).toFixed(2)}`;
    document.getElementById('confirm-cash').disabled = change < 0;
}

function completeCashPayment() {
    closeCashModal();
    processPayment();
}

function processPayment() {
    // Update stock
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });

    // Generate receipt
    generateReceipt();
    
    // Reset for next sale
    cart = [];
    selectedPaymentMethod = null;
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('selected'));
    updateCart();
    renderProducts(); // Update stock display
}

// Receipt Generation
function generateReceipt() {
    const modal = document.getElementById('receipt-modal');
    const now = new Date();
    const transactionId = 'TXN' + Date.now();
    
    // Set receipt date
    document.getElementById('receipt-date').textContent = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Set transaction ID
    document.getElementById('transaction-id').textContent = transactionId;
    
    // Set items
    const receiptItems = document.getElementById('receipt-items');
    receiptItems.innerHTML = cart.map(item => `
        <div class="receipt-item">
            <span class="receipt-item-name">${item.name}</span>
            <span class="receipt-item-qty">x${item.quantity}</span>
            <span class="receipt-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    // Set summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    document.getElementById('receipt-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('receipt-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('receipt-total').textContent = `$${total.toFixed(2)}`;
    
    // Set payment method
    const paymentMethodText = {
        'cash': '💵 Cash',
        'card': '💳 Card',
        'mobile': '📱 Mobile Payment'
    };
    document.getElementById('receipt-payment').textContent = paymentMethodText[selectedPaymentMethod] || 'Unknown';
    
    // Show modal
    modal.classList.add('active');
}

function closeReceiptModal() {
    document.getElementById('receipt-modal').classList.remove('active');
}

// Helper Functions
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    return subtotal + tax;
}

// Make functions globally accessible
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
