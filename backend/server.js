const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://*.onrender.com'],
  credentials: true,
}));
app.use(cookieParser());

// API Routes (must come BEFORE static file serving)
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// ===== SERVE FRONTEND STATIC FILES =====
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// All non-API routes go to React
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));