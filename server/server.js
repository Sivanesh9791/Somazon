require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/api', (req, res) => {
  res.json({ message: 'Somazon API is running' });
});

// Auth Routes
app.use('/api/auth', authRoutes);

// Product Routes
app.use('/api/products', productRoutes);

// Order Routes
app.use('/api/orders', orderRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Error Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
