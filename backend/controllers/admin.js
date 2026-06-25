const db = require('../data/mockDb');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const { total: totalPGs } = db.findAll('pgs', {});
    const { total: activePGs } = db.findAll('pgs', { active: true });
    const { total: totalUsers } = db.findAll('users', {});
    const { total: totalReviews } = db.findAll('reviews', {});

    const allUsers = db.findAll('users', {}).data;
    const adminCount = allUsers.filter(u => u.role === 'admin').length;
    const userCount = allUsers.filter(u => u.role === 'user').length;

    const allPGs = db.findAll('pgs', {}).data;
    const avgRent = allPGs.length > 0
      ? Math.round(allPGs.reduce((sum, pg) => sum + pg.rent, 0) / allPGs.length)
      : 0;

    const genderBreakdown = {
      boys: allPGs.filter(p => p.gender === 'boys').length,
      girls: allPGs.filter(p => p.gender === 'girls').length,
      coEd: allPGs.filter(p => p.gender === 'co-ed').length,
    };

    const recentPGs = db.findAll('pgs', {}, { sort: '-createdAt', limit: 5 }).data;
    const recentReviews = db.findAll('reviews', {}, { sort: '-createdAt', limit: 5 }).data;

    const reviewsWithMeta = recentReviews.map(review => {
      const user = db.findById('users', review.userId);
      const pg = db.findById('pgs', review.pgId);
      return {
        ...review,
        user: user ? { _id: user._id, name: user.name } : null,
        pg: pg ? { _id: pg._id, name: pg.name } : null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalPGs,
        activePGs,
        totalUsers,
        totalReviews,
        adminCount,
        userCount,
        avgRent,
        genderBreakdown,
        recentPGs,
        recentReviews: reviewsWithMeta,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const options = {
      sort: '-createdAt',
      limit: parseInt(req.query.limit, 10) || 50,
      skip: ((parseInt(req.query.page, 10) || 1) - 1) * (parseInt(req.query.limit, 10) || 50),
    };

    const { data, total } = db.findAll('users', {}, options);

    const usersWithoutPasswords = data.map(({ password, ...user }) => {
      const reviewCount = db.findAll('reviews', { userId: user._id }).total;
      const favorites = (user.favorites || []).map(fav => {
        const pgId = typeof fav === 'object' ? fav.pgId : fav;
        const favoritedAt = typeof fav === 'object' ? fav.favoritedAt : null;
        const pg = db.findById('pgs', pgId);
        return pg ? { ...pg, favoritedAt } : null;
      }).filter(Boolean);
      return { ...user, reviewCount, favorites };
    });

    res.status(200).json({
      success: true,
      count: usersWithoutPasswords.length,
      total,
      data: usersWithoutPasswords,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = db.findById('users', req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id === req.user._id) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    const updated = db.update('users', req.params.id, { role: req.body.role });
    const { password, ...userWithoutPassword } = updated;
    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = db.findById('users', req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id === req.user._id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    db.findAll('reviews', { userId: user._id }).data.forEach(r => db.delete('reviews', r._id));
    db.delete('users', req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const options = {
      sort: '-createdAt',
      limit: parseInt(req.query.limit, 10) || 50,
      skip: ((parseInt(req.query.page, 10) || 1) - 1) * (parseInt(req.query.limit, 10) || 50),
    };

    const { data, total } = db.findAll('reviews', {}, options);

    const reviewsWithMeta = data.map(review => {
      const user = db.findById('users', review.userId);
      const pg = db.findById('pgs', review.pgId);
      return {
        ...review,
        user: user ? { _id: user._id, name: user.name, email: user.email } : null,
        pg: pg ? { _id: pg._id, name: pg.name } : null,
      };
    });

    res.status(200).json({
      success: true,
      count: reviewsWithMeta.length,
      total,
      data: reviewsWithMeta,
    });
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

    const pgId = review.pgId;
    db.delete('reviews', req.params.id);

    const reviews = db.findAll('reviews', { pgId }).data;
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      db.update('pgs', pgId, {
        rating: Math.round(avgRating * 10) / 10,
        numReviews: reviews.length,
      });
    } else {
      db.update('pgs', pgId, { rating: 0, numReviews: 0 });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = db.getSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = db.updateSettings(req.body);
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};
