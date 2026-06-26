const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const PG = require('../models/PG');
const { sendOTP } = require('../utils/email');
const { sendPhoneOTP } = require('../utils/phoneOtp');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
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

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const user = await User.create({
      name,
      phone,
      password,
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

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
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

    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      $inc: { loginCount: 1 },
    });

    const updatedUser = await User.findById(user._id);
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

    const user = await User.findOne({ phone }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      $inc: { loginCount: 1 },
    });

    const updatedUser = await User.findById(user._id);
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

    const user = await User.findOne({ phone });
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

    await User.findByIdAndUpdate(user._id, {
      phoneVerified: true,
      phoneOTP: null,
      phoneOTPExpiry: null,
      verifiedDevices: newDevices,
      lastLogin: new Date(),
      $inc: { loginCount: 1 },
    });

    const updatedUser = await User.findById(user._id);
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

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.phoneVerified && !isLogin) {
      return res.status(400).json({ success: false, message: 'Phone already verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
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

    const user = await User.findOne({ email });
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

    await User.findByIdAndUpdate(user._id, {
      emailVerified: true,
      verificationOTP: null,
      verificationOTPExpiry: null,
    });

    const updatedUser = await User.findById(user._id);
    sendTokenResponse(updatedUser, 200, res);
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
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
    const user = await User.findById(req.user._id).populate('favorites.pgId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const favorites = user.favorites
      .filter(fav => fav.pgId)
      .map(fav => ({ ...fav.pgId.toObject(), favoritedAt: fav.favoritedAt }));
    res.status(200).json({ success: true, data: { ...user.toObject(), favorites } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name: req.body.name }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const alreadyFavorited = user.favorites.some(f => f.pgId.toString() === req.params.pgId);
    if (!alreadyFavorited) {
      user.favorites.push({ pgId: req.params.pgId, favoritedAt: new Date() });
      await user.save();
    }
    res.status(200).json({ success: true, data: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.favorites = user.favorites.filter(fav => fav.pgId.toString() !== req.params.pgId);
    await user.save();
    res.status(200).json({ success: true, data: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites.pgId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const favorites = user.favorites
      .filter(fav => fav.pgId)
      .map(fav => ({ ...fav.pgId.toObject(), favoritedAt: fav.favoritedAt }));
    res.status(200).json({ success: true, data: favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'staynear_jwt_secret_key_2024', {
    expiresIn: '7d'
  });
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userObj
    });
};
