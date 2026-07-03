// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (This allows your phone app to talk to this backend safely)
app.use(cors());
app.use(express.json());

// Simulated Database (In a real app, this would be MongoDB or PostgreSQL)
let ordersList = [];
let menuItemsList = [
  { id: 'cappuccino', name: 'Classic Cappuccino', price: 120 },
  { id: 'chocolate-muffin', name: 'Signature Chocolate Muffin', price: 110 }
];

// --- ROUTES (The endpoints your frontend app will call) ---

// 1. Welcome Route (Just to check if the server is alive)
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Lake View Cafe Backend Server! ☕" });
});

// 2. Get Menu Route (Frontend uses this to load the items and prices)
app.get('/api/menu', (req, res) => {
  res.json(menuItemsList);
});

// 3. Place Order Route (The frontend sends cart data here when checkout is clicked)
app.post('/api/orders', (req, res) => {
  const { customerName, customerPhone, items, totalAmount, serviceMode } = req.body;

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Missing order details!" });
  }

  // Create a new order object
  const newOrder = {
    orderId: 'LVC-' + Math.floor(1000 + Math.random() * 9000), // e.g., LVC-4829
    customerName,
    customerPhone,
    items,
    totalAmount,
    serviceMode,
    status: 'Received', // Steps: Received -> Preparing -> Brewing -> Ready
    timestamp: new Date()
  };

  ordersList.push(newOrder);
  
  console.log(`✉️ New Order Created: ${newOrder.orderId} for ${customerName}`);
  res.status(201).json({ success: true, message: "Order sent to kitchen!", order: newOrder });
});

// 4. Kitchen Dashboard Route (The cafe staff opens this to see pending orders)
app.get('/api/kitchen/orders', (req, res) => {
  res.json(ordersList);
});

// 5. Update Order Status Route (Staff clicks a button to change status to 'Brewing' or 'Ready')
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., "Ready"

  const order = ordersList.find(o => o.orderId === id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  order.status = status;
  res.json({ success: true, message: `Order status updated to ${status}`, order });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Lake View Cafe kitchen server running on http://localhost:${PORT}`);
});