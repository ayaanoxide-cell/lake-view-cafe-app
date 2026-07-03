const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let ordersList = [];
let menuItemsList = [
  { id: 'cappuccino', name: 'Classic Cappuccino', price: 120 },
  { id: 'chocolate-muffin', name: 'Signature Chocolate Muffin', price: 110 }
];

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Lake View Cafe Backend Server! ☕" });
});

// Get Menu Route
app.get('/api/menu', (req, res) => {
  res.json(menuItemsList);
});

// Place Order Route
app.post('/api/orders', (req, res) => {
  const { customerName, customerPhone, items, totalAmount, serviceMode } = req.body;

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Missing order details!" });
  }

  const newOrder = {
    orderId: 'LVC-' + Math.floor(1000 + Math.random() * 9000),
    customerName,
    customerPhone,
    items,
    totalAmount,
    serviceMode,
    status: 'Received',
    timestamp: new Date()
  };

  ordersList.push(newOrder);
  res.status(201).json({ success: true, message: "Order sent to kitchen!", order: newOrder });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
