require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! 🎉'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// JWT Protection Middleware (load it early)
const authenticateJWT = require('./middlewares/auth');

// Apply protection FIRST for protected routes
app.use('/products', authenticateJWT);
app.use('/orders', authenticateJWT);
app.use('/dashboard', authenticateJWT);

// Now register routes
app.use('/auth', require('./routes/auth'));                    // Public
app.use('/products', require('./routes/products'));            // Protected
app.use('/orders', require('./routes/orders'));                // Protected
app.use('/dashboard', require('./routes/dashboard'));          // Protected

// Public test route
app.get('/', (req, res) => {
  res.send(`
    <h1>Product & Sales Management Dashboard Backend 🚀</h1>
    <p><strong>Public:</strong> POST /auth/login</p>
    <p><strong>Protected:</strong></p>
    <ul>
      <li>GET/POST/PUT/DELETE /products</li>
      <li>GET/POST /orders</li>
      <li>GET /dashboard/summary</li>
    </ul>
    <p>Backend is running perfectly!</p>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});