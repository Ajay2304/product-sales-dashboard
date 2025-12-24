const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! 🎉'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('Backend + MongoDB connected! Ready for products & orders 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});