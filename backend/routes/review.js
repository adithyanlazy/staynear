const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/review');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getReviews)
  .post(protect, addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/pg/:pgId').get(getReviews);

module.exports = router;
