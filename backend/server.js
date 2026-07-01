const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const { getSettings } = require('./utils/settingsCache');

dotenv.config();

const app = express();

// Behind Render's proxy: lets express-rate-limit key off the real client IP
// instead of a spoofable X-Forwarded-For header.
app.set('trust proxy', 1);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please wait a few minutes.' },
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/login-phone', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/register-phone', authLimiter);
app.use('/api/auth/verify-email', authLimiter);
app.use('/api/auth/resend-verification', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

app.use(cors({
  origin: function(origin, callback) {
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    const allowed = (process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(u => u.trim()) : ['http://localhost:5173']);
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Strip Mongo operators from user input so query objects like
// { "phone": { "$ne": null } } can't reach the database.
const stripUnsafeKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      stripUnsafeKeys(obj[key]);
    }
  }
};
app.use((req, res, next) => {
  stripUnsafeKeys(req.body);
  stripUnsafeKeys(req.query);
  stripUnsafeKeys(req.params);
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Maintenance mode: block public API when enabled. Health, auth, and admin
// stay reachable so an admin can still log in and switch it back off.
app.use(async (req, res, next) => {
  if (
    req.path === '/api/health' ||
    req.path.startsWith('/api/auth') ||
    req.path.startsWith('/api/admin')
  ) {
    return next();
  }
  try {
    const settings = await getSettings();
    if (settings.maintenanceMode) {
      return res.status(503).json({ success: false, message: 'Site is under maintenance. Please check back soon.' });
    }
  } catch (err) {
    // DB hiccup while checking the flag shouldn't take the whole API down.
  }
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/pgs', require('./routes/pg'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/admin', require('./routes/admin'));



app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/suggestions', async (req, res) => {
  try {
    const settings = await getSettings();
    res.status(200).json({ success: true, data: { areas: settings.areas, colleges: settings.colleges } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/site-logo', async (req, res) => {
  try {
    const settings = await getSettings();
    res.status(200).json({ success: true, data: { siteLogo: settings.siteLogo || '', siteName: settings.siteName || 'StayNear' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    res.status(200).json({
      success: true,
      data: {
        siteName: settings.siteName || 'StayNear',
        siteLogo: settings.siteLogo || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const settings = await getSettings();
    res.status(200).json({ success: true, data: settings.testimonials || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

start();
