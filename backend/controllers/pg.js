const PG = require('../models/PG');
const Review = require('../models/Review');
const Settings = require('../models/Settings');

const PG_FIELDS = [
  'name', 'description', 'rent', 'deposit', 'gender', 'foodIncluded',
  'acAvailable', 'sharingType', 'area', 'collegeNearby', 'address',
  'images', 'videos', 'amenities',
  'contactNumber', 'contactName', 'featured', 'active'
];

const sanitizePGInput = (body) => {
  const sanitized = {};
  for (const field of PG_FIELDS) {
    if (body[field] !== undefined) {
      sanitized[field] = body[field];
    }
  }
  return sanitized;
};

exports.getPGs = async (req, res, next) => {
  try {
    const filter = { active: true };

    if (req.query.area) filter.area = req.query.area;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.foodIncluded !== undefined) filter.foodIncluded = req.query.foodIncluded === 'true';
    if (req.query.acAvailable !== undefined) filter.acAvailable = req.query.acAvailable === 'true';
    if (req.query.sharingType) filter.sharingType = req.query.sharingType;
    if (req.query.collegeNearby) filter.collegeNearby = req.query.collegeNearby;

    if (req.query.minRent || req.query.maxRent) {
      filter.rent = {};
      if (req.query.minRent) filter.rent.$gte = parseInt(req.query.minRent);
      if (req.query.maxRent) filter.rent.$lte = parseInt(req.query.maxRent);
    }

    const sort = req.query.sort || '-createdAt';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    let query;
    if (req.query.search) {
      query = PG.find({ ...filter, $text: { $search: req.query.search } });
    } else {
      query = PG.find(filter);
    }

    const total = await PG.countDocuments(filter);
    const data = await query.sort(sort).skip(skip).limit(limit);

    const pagination = {};
    const endIndex = page * limit;
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (skip > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: data.length,
      total,
      pagination,
      data
    });
  } catch (err) {
    next(err);
  }
};

exports.getPG = async (req, res, next) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }
    res.status(200).json({ success: true, data: pg });
  } catch (err) {
    next(err);
  }
};

exports.createPG = async (req, res, next) => {
  try {
    const sanitized = sanitizePGInput(req.body);
    const pg = await PG.create(sanitized);
    res.status(201).json({ success: true, data: pg });
  } catch (err) {
    next(err);
  }
};

exports.updatePG = async (req, res, next) => {
  try {
    const sanitized = sanitizePGInput(req.body);
    const pg = await PG.findByIdAndUpdate(req.params.id, sanitized, { new: true, runValidators: true });
    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }
    res.status(200).json({ success: true, data: pg });
  } catch (err) {
    next(err);
  }
};

exports.deletePG = async (req, res, next) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }
    await PG.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ pg: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedPGs = async (req, res, next) => {
  try {
    const data = await PG.find({ featured: true, active: true }).limit(6);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getPGsByCollege = async (req, res, next) => {
  try {
    const data = await PG.find({ collegeNearby: req.params.college, active: true });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getSimilarPGs = async (req, res, next) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }

    const similar = await PG.find({
      area: pg.area,
      gender: pg.gender,
      active: true,
      _id: { $ne: pg._id }
    }).limit(4);

    res.status(200).json({ success: true, data: similar });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalPGs = await PG.countDocuments({ active: true });
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    const avgResult = await PG.aggregate([
      { $match: { active: true } },
      { $group: { _id: null, avgRent: { $avg: '$rent' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPGs,
        totalAreas: settings.areas.length,
        avgRent: avgResult.length > 0 ? Math.round(avgResult[0].avgRent) : 0,
        happyStudents: settings.happyStudents || '2000+',
        avgRating: settings.avgRating || '4.5'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllPGsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await PG.countDocuments();
    const data = await PG.find().sort('-createdAt').skip(skip).limit(limit);

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

exports.getPopularAreas = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings || !settings.popularAreas || settings.popularAreas.length === 0) {
      return res.status(200).json({
        success: true,
        data: [
          { name: 'Surathkal', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
          { name: 'Hampankatta', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
          { name: 'Kadri', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' },
          { name: 'Bejai', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400' },
          { name: 'Kankanady', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' },
          { name: 'Falnir', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' }
        ]
      });
    }
    res.status(200).json({ success: true, data: settings.popularAreas });
  } catch (err) {
    next(err);
  }
};
