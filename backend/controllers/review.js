const db = require('../data/mockDb');

exports.getReviews = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.pgId) {
      filter = { pgId: req.params.pgId };
    }

    const { data } = db.findAll('reviews', filter, { sort: '-createdAt' });

    const reviewsWithUser = data.map(review => {
      const user = db.findById('users', review.userId);
      const pg = db.findById('pgs', review.pgId);
      return {
        ...review,
        user: user ? { _id: user._id, name: user.name } : null,
        pg: pg ? { _id: pg._id, name: pg.name } : null
      };
    });

    res.status(200).json({ success: true, count: reviewsWithUser.length, data: reviewsWithUser });
  } catch (err) {
    next(err);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = db.findById('reviews', req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const user = db.findById('users', review.userId);
    const pg = db.findById('pgs', review.pgId);

    res.status(200).json({
      success: true,
      data: {
        ...review,
        user: user ? { _id: user._id, name: user.name } : null,
        pg: pg ? { _id: pg._id, name: pg.name } : null
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const pgId = req.params.pgId;
    const pg = db.findById('pgs', pgId);

    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }

    const existingReview = db.findAll('reviews', { userId: req.user._id, pgId }).data;
    if (existingReview.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this PG' });
    }

    const review = db.create('reviews', {
      userId: req.user._id,
      pgId,
      rating: req.body.rating,
      comment: req.body.comment
    });

    updatePGRating(pgId);

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    let review = db.findById('reviews', req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    review = db.update('reviews', req.params.id, {
      rating: req.body.rating || review.rating,
      comment: req.body.comment || review.comment
    });

    updatePGRating(review.pgId);

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = db.findById('reviews', req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const pgId = review.pgId;
    db.delete('reviews', req.params.id);
    
    updatePGRating(pgId);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

function updatePGRating(pgId) {
  const reviews = db.findAll('reviews', { pgId }).data;
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    db.update('pgs', pgId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length
    });
  } else {
    db.update('pgs', pgId, { rating: 0, numReviews: 0 });
  }
}
