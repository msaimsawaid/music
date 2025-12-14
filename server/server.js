
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // ADD THIS LINE
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// =================== RATE LIMITING ===================
// Skip rate limiting in test environment
const skipRateLimit = () => process.env.NODE_ENV === 'test';

// General API limiter (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable old headers
  skip: skipRateLimit // Don't apply in tests
});

// Stricter limiter for auth routes (5 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login/register attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  skip: skipRateLimit // Don't apply in tests
});

// =================== MIDDLEWARE ===================
app.use(cors({
  origin: 'http://localhost:3000', // Your React app
  credentials: true
}));
app.use(express.json());

// Apply rate limiting middleware
app.use('/api/', apiLimiter); // Apply to all API routes
app.use('/api/auth', authLimiter); // Stricter limit for auth

// =================== DATABASE CONNECTION ===================
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/music-world')     
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// =================== ROUTES ===================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve Uploads
app.use('/server/uploads', express.static('server/uploads'));

// =================== BASIC ROUTES ===================
app.get('/', (req, res) => {
    res.send('Music World API is running');
});

// Health check endpoint (not rate limited)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// =================== ERROR HANDLING ===================
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler (should be last)
app.use(errorHandler);

// =================== SERVER START ===================
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        if (process.env.NODE_ENV !== 'test') {
          console.log(`🔒 Rate limiting enabled:`);
          console.log(`   - General API: 100 requests per 15 minutes`);
          console.log(`   - Auth routes: 5 attempts per 15 minutes`);
        }
    });
}

module.exports = app;