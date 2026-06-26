const PG = require('../models/PG');
const User = require('../models/User');
const Review = require('../models/Review');
const Settings = require('../models/Settings');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalPGs = await PG.countDocuments();
    const activePGs = await PG.countDocuments({ active: true });
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();

    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });

    const avgResult = await PG.aggregate([
      { $group: { _id: null, avgRent: { $avg: '$rent' } } }
    ]);
    const avgRent = avgResult.length > 0 ? Math.round(avgResult[0].avgRent) : 0;

    const genderResult = await PG.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    const genderBreakdown = { boys: 0, girls: 0, coEd: 0 };
    genderResult.forEach(g => {
      if (g._id === 'boys') genderBreakdown.boys = g.count;
      if (g._id === 'girls') genderBreakdown.girls = g.count;
      if (g._id === 'co-ed') genderBreakdown.coEd = g.count;
    });

    const recentPGs = await PG.find().sort('-createdAt').limit(5);
    const recentReviews = await Review.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name')
      .populate('pg', 'name');

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
        recentReviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('favorites.pgId');

    const usersWithMeta = await Promise.all(users.map(async (user) => {
      const reviewCount = await Review.countDocuments({ user: user._id });
      const favorites = user.favorites
        .filter(f => f.pgId)
        .map(f => ({ ...f.pgId.toObject(), favoritedAt: f.favoritedAt }));
      return { ...user.toObject(), reviewCount, favorites };
    }));

    res.status(200).json({
      success: true,
      count: usersWithMeta.length,
      total,
      data: usersWithMeta,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    await Review.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await Review.countDocuments();
    const data = await Review.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('pg', 'name');

    res.status(200).json({
      success: true,
      count: data.length,
      total,
      data,
    });
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

    const pgId = review.pg;
    await Review.findByIdAndDelete(req.params.id);

    await Review.getAverageRating(pgId);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: 'StayNear',
        siteDescription: 'Find the best PG accommodations near your college in Mangalore',
        contactEmail: 'contact@staynear.com',
        contactPhone: '+91 9876543210',
      });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      const { areas, colleges, popularAreas, siteName, siteDescription, contactEmail, contactPhone, maintenanceMode, allowRegistrations, maxImagesPerPG } = req.body;
      if (areas !== undefined) settings.areas = areas;
      if (colleges !== undefined) settings.colleges = colleges;
      if (popularAreas !== undefined) settings.popularAreas = popularAreas;
      if (siteName !== undefined) settings.siteName = siteName;
      if (siteDescription !== undefined) settings.siteDescription = siteDescription;
      if (contactEmail !== undefined) settings.contactEmail = contactEmail;
      if (contactPhone !== undefined) settings.contactPhone = contactPhone;
      if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
      if (allowRegistrations !== undefined) settings.allowRegistrations = allowRegistrations;
      if (maxImagesPerPG !== undefined) settings.maxImagesPerPG = maxImagesPerPG;
      await settings.save();
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};
