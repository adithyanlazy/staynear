const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

dotenv.config();

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
  message: { success: false, message: 'Too many requests. Please wait a few minutes.' },
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/login-phone', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/register-phone', authLimiter);
app.use('/api/auth/verify-email', authLimiter);
app.use('/api/auth/resend-verification', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

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

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/pgs', require('./routes/pg'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/admin', require('./routes/admin'));



app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const Settings = require('./models/Settings');

const settingsCache = { data: null, ts: 0 };
const SETTINGS_TTL = 60 * 1000;

const getSettings = async () => {
  const now = Date.now();
  if (settingsCache.data && now - settingsCache.ts < SETTINGS_TTL) {
    return settingsCache.data;
  }
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  settingsCache.data = settings;
  settingsCache.ts = now;
  return settings;
};

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
