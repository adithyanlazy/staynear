const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../data/mockDb');
const { sendOTP } = require('../utils/email');
const { sendPhoneOTP } = require('../utils/phoneOtp');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = db.findAll('users', { email }).data;
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = db.create('users', {
      name,
      email,
      password: hashedPassword,
      role: 'user',
      favorites: [],
      emailVerified: true,
    });

    console.log(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      requiresVerification: false,
      email,
    });
  } catch (err) {
    next(err);
  }
};

exports.registerPhone = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, phone, and password' });
    }

    const existingUser = db.findAll('users', { phone }).data;
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = db.create('users', {
      name,
      phone,
      password: hashedPassword,
      role: 'user',
      favorites: [],
      phoneVerified: true,
      verifiedDevices: [],
    });

    console.log(`New user registered via phone: ${phone}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      requiresVerification: false,
      phone,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const users = db.findAll('users', { email }).data;
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
        requiresVerification: true,
        email,
      });
    }

    db.update('users', user._id, {
      lastLogin: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
    });

    const updatedUser = db.findById('users', user._id);
    sendTokenResponse(updatedUser, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.loginPhone = async (req, res, next) => {
  try {
    const { phone, password, deviceId } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide phone and password' });
    }

    const users = db.findAll('users', { phone }).data;
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    db.update('users', user._id, {
      lastLogin: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
    });

    const updatedUser = db.findById('users', user._id);
    sendTokenResponse(updatedUser, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.verifyPhone = async (req, res, next) => {
  try {
    const { phone, otp, deviceId } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide phone and OTP' });
    }

    const users = db.findAll('users', { phone }).data;
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.phoneOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (new Date(user.phoneOTPExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    const verifiedDevices = user.verifiedDevices || [];
    const newDevices = deviceId && !verifiedDevices.includes(deviceId)
      ? [...verifiedDevices, deviceId]
      : verifiedDevices;

    db.update('users', user._id, {
      phoneVerified: true,
      phoneOTP: null,
      phoneOTPExpiry: null,
      verifiedDevices: newDevices,
      lastLogin: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
    });

    const updatedUser = db.findById('users', user._id);
    sendTokenResponse(updatedUser, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.resendPhoneOTP = async (req, res, next) => {
  try {
    const { phone, isLogin } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Please provide phone number' });
    }

    const users = db.findAll('users', { phone }).data;
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.phoneVerified && !isLogin) {
      return res.status(400).json({ success: false, message: 'Phone already verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    db.update('users', user._id, {
      phoneOTP: otp,
      phoneOTPExpiry: otpExpiry,
    });

    await sendPhoneOTP(phone, otp, isLogin);

    const response = { success: true, message: 'Verification code sent' };

    if (process.env.NODE_ENV === 'development') {
      response.devOTP = otp;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    const users = db.findAll('users', { email }).data;
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    if (user.verificationOTP !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (new Date(user.verificationOTPExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    db.update('users', user._id, {
      emailVerified: true,
      verificationOTP: null,
      verificationOTPExpiry: null,
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email' });
    }

    const users = db.findAll('users', { email }).data;
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    db.update('users', user._id, {
      verificationOTP: otp,
      verificationOTPExpiry: otpExpiry,
    });

    await sendOTP(email, otp);

    res.status(200).json({ success: true, message: 'Verification code sent' });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = db.findById('users', req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    const favorites = user.favorites.map(fav => {
      const pgId = typeof fav === 'object' ? fav.pgId : fav;
      const favoritedAt = typeof fav === 'object' ? fav.favoritedAt : null;
      const pg = db.findById('pgs', pgId);
      return pg ? { ...pg, favoritedAt } : null;
    }).filter(Boolean);
    res.status(200).json({ success: true, data: { ...userWithoutPassword, favorites } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = db.update('users', req.user._id, { name: req.body.name });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const user = db.findById('users', req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const alreadyFavorited = user.favorites.some(f => (typeof f === 'object' ? f.pgId : f) === req.params.pgId);
    if (!alreadyFavorited) {
      user.favorites.push({ pgId: req.params.pgId, favoritedAt: new Date().toISOString() });
      db.update('users', req.user._id, { favorites: user.favorites });
    }
    res.status(200).json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const user = db.findById('users', req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.favorites = user.favorites.filter(fav => (typeof fav === 'object' ? fav.pgId : fav) !== req.params.pgId);
    db.update('users', req.user._id, { favorites: user.favorites });
    res.status(200).json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const user = db.findById('users', req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const favorites = user.favorites.map(fav => {
      const pgId = typeof fav === 'object' ? fav.pgId : fav;
      const favoritedAt = typeof fav === 'object' ? fav.favoritedAt : null;
      const pg = db.findById('pgs', pgId);
      return pg ? { ...pg, favoritedAt } : null;
    }).filter(Boolean);
    res.status(200).json({ success: true, data: favorites });
  } catch (err) {
    next(err);
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'staynear_mock_secret', {
    expiresIn: '7d'
  });
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const { password, ...userWithoutPassword } = user;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userWithoutPassword
    });
};
