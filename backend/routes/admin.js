const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllReviews,
  deleteReview,
  getSettings,
  updateSettings,
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
