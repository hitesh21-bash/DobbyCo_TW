const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS middleware (allow both local and production)
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://*.onrender.com'],
    credentials: true,
  })
);

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🐾 DobbyCo Pet Services API is running!',
    timestamp: new Date().toISOString(),
  });
});

// ===== SERVE FRONTEND STATIC FILES =====
// This is the key addition for single-platform deployment
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// All non-API routes go to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
const { errorHandler } = require('./src/middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🛢️  MongoDB: Connected to DobbyCo database`);
  console.log(`🎨 Frontend serving from: ${frontendPath}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});