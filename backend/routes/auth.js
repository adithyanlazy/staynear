const express = require('express');
const router = express.Router();
const {
  register,
  registerPhone,
  login,
  loginPhone,
  verifyEmail,
  verifyPhone,
  resendVerification,
  resendPhoneOTP,
  getMe,
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-phone', registerPhone);
router.post('/login', login);
router.post('/login-phone', loginPhone);
router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone);
router.post('/resend-verification', resendVerification);
router.post('/resend-phone-otp', resendPhoneOTP);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.post('/favorites/:pgId', protect, addFavorite);
router.delete('/favorites/:pgId', protect, removeFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;
