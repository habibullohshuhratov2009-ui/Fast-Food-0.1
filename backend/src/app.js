const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── Health Check ───────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Fast-food API is running 🍔', timestamp: new Date().toISOString() });
});

// ── Routes ─────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', authRoutes);

// ── Error Handling ─────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
