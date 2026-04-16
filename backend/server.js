const express = require('express');
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

// CORS middleware - allow your Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dobbyco-tw.vercel.app',
    'https://dobbyco-tw.vercel.app/',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Root route - API info
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DobbyCo API is running!',
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      auth: '/api/auth',
      bookings: '/api/bookings',
      users: '/api/users'
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`
  });
});

// Error handling middleware
const { errorHandler } = require('./src/middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🛢️  MongoDB: Connected to DobbyCo database`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});