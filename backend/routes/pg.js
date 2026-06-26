const express = require('express');
const router = express.Router();
const {
  getPGs,
  getPG,
  createPG,
  updatePG,
  deletePG,
  getFeaturedPGs,
  getPGsByCollege,
  getSimilarPGs,
  getStats,
  getPopularAreas
} = require('../controllers/pg');
const { protect, authorize } = require('../middleware/auth');

router.route('/featured').get(getFeaturedPGs);
router.route('/popular-areas').get(getPopularAreas);
router.route('/stats').get(getStats);
router.route('/college/:college').get(getPGsByCollege);
router.route('/:id/similar').get(getSimilarPGs);

router
  .route('/')
  .get(getPGs)
  .post(protect, authorize('admin'), createPG);

router
  .route('/:id')
  .get(getPG)
  .put(protect, authorize('admin'), updatePG)
  .delete(protect, authorize('admin'), deletePG);

module.exports = router;
