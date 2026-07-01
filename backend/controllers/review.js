const Review = require('../models/Review');
const PG = require('../models/PG');

exports.getReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.pgId) {
      filter = { pg: req.params.pgId };
    }

    const data = await Review.find(filter)
      .sort('-createdAt')
      .populate('user', 'name')
      .populate('pg', 'name');

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name')
      .populate('pg', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const pgId = req.params.pgId;
    const pg = await PG.findById(pgId);

    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }

    const existingReview = await Review.findOne({ user: req.user._id, pg: pgId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this PG' });
    }

    const review = await Review.create({
      user: req.user._id,
      pg: pgId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, {
      rating: req.body.rating !== undefined ? req.body.rating : review.rating,
      comment: req.body.comment !== undefined ? req.body.comment : review.comment
    }, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const pgId = review.pg;
    await Review.findByIdAndDelete(req.params.id);

    await Review.getAverageRating(pgId);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
