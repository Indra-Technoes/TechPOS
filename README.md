# 🛒 Kilo Point of Sale System

A modern, fully-featured Point of Sale (POS) system built with HTML, CSS, and JavaScript. Perfect for retail stores, restaurants, and small businesses.

## ✨ Features

### 🎯 Core Functionality
- **Product Management**: Pre-loaded with 24 products across 4 categories
- **Real-time Cart**: Add, remove, and adjust quantities instantly
- **Multiple Payment Methods**: Cash, Card, and Mobile payments
- **Receipt Generation**: Professional receipts with transaction details
- **Stock Management**: Automatic stock tracking and updates
- **Search & Filter**: Quick product search and category filtering

### 💳 Payment Processing
- **Cash Payments**: Calculate change automatically with quick amount buttons
- **Card Payments**: Instant processing
- **Mobile Payments**: Quick digital payment option

### 📊 Product Categories
- **Food**: Pizza, Burger, Sandwich, Hot Dog, Taco, Sushi
- **Drinks**: Coffee, Soda, Beer, Wine, Juice, Water
- **Electronics**: Headphones, Phone, Laptop, Watch, Camera, Speaker
- **Clothing**: T-Shirt, Jeans, Dress, Shoes, Hat, Jacket

### 🎨 User Interface
- Modern, responsive design
- Real-time date and time display
- Intuitive product grid layout
- Clear cart visualization
- Professional receipt printing

## 🚀 Getting Started

### Installation
1. Download all files to a directory:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Open `index.html` in a web browser

That's it! No server or dependencies required.

### Usage

#### Adding Products to Cart
1. Browse products by category or use the search bar
2. Click on any product card to add it to the cart
3. Adjust quantities using the + and - buttons
4. Remove items with the × button

#### Processing a Sale
1. Add items to the cart
2. Select a payment method (Cash, Card, or Mobile)
3. Click "Complete Sale"
4. For cash payments:
   - Enter the amount received
   - Use quick amount buttons for common denominations
   - View calculated change
   - Confirm payment
5. View and print the receipt

#### Managing the Cart
- **Clear All**: Remove all items from the cart
- **Adjust Quantity**: Use +/- buttons on each item
- **Remove Item**: Click the × button

## 📱 Responsive Design

The POS system is fully responsive and works on:
- Desktop computers (optimal experience)
- Tablets
- Mobile devices

## 🎯 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks or libraries required

### Key Features
- **Tax Calculation**: Automatic 10% tax calculation
- **Stock Validation**: Prevents overselling
- **Transaction IDs**: Unique ID for each sale
- **Print Support**: Optimized receipt printing

### File Structure
```
kilo-pos/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Application logic and functionality
└── README.md       # Documentation
```

## 🔧 Customization

### Modifying Products
Edit the `products` array in `script.js`:
```javascript
const products = [
    { 
        id: 1, 
        name: 'Product Name', 
        price: 9.99, 
        category: 'food', 
        icon: '🍕', 
        stock: 25 
    },
    // Add more products...
];
```

### Changing Tax Rate
Modify the `TAX_RATE` constant in `script.js`:
```javascript
const TAX_RATE = 0.10; // 10% tax
```

### Customizing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    /* Modify other colors... */
}
```

## 📋 Features Breakdown

### Product Display
- Grid layout with product cards
- Product icon, name, price, and stock
- Hover effects for better UX
- Category-based filtering
- Real-time search

### Shopping Cart
- Live cart updates
- Quantity controls
- Item removal
- Subtotal, tax, and total calculation
- Empty cart state

### Payment System
- Multiple payment method selection
- Cash payment with change calculation
- Quick amount buttons ($5, $10, $20, $50, $100)
- Payment validation

### Receipt System
- Professional receipt layout
- Transaction ID
- Date and time stamp
- Itemized list with quantities
- Payment method display
- Print functionality

## 🎨 Design Highlights

- **Modern UI**: Clean, professional interface
- **Color Coded**: Different colors for actions (success, danger, primary)
- **Smooth Animations**: Transitions and hover effects
- **Accessibility**: Clear labels and intuitive controls
- **Print Optimized**: Receipt prints cleanly

## 🔒 Business Logic

### Stock Management
- Real-time stock tracking
- Prevents overselling
- Updates after each sale
- Stock display on product cards

### Transaction Flow
1. Add items to cart
2. Select payment method
3. Process payment
4. Update stock
5. Generate receipt
6. Reset for next sale

## 💡 Tips for Use

1. **Quick Sales**: Use category tabs for faster product selection
2. **Search**: Type product names for instant filtering
3. **Cash Handling**: Use quick amount buttons for common bills
4. **Receipt Printing**: Use browser print (Ctrl+P or Cmd+P)
5. **Stock Monitoring**: Check product cards for current stock levels

## 🌟 Future Enhancement Ideas

- User authentication
- Sales reports and analytics
- Customer management
- Discount and promotion system
- Barcode scanner integration
- Multiple currency support
- Database integration
- Cloud sync
- Employee management
- Inventory alerts

## 📄 License

This project is created by Kilo Code and is free to use and modify.

## 🤝 Support

For issues or questions, refer to the code comments in each file for detailed explanations of functionality.

---

**Built with ❤️ by Kilo Code**
