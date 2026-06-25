const db = require('../data/mockDb');

exports.getPGs = async (req, res, next) => {
  try {
    const filter = {};
    const options = {};

    if (req.query.area) filter.area = req.query.area;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.foodIncluded) filter.foodIncluded = req.query.foodIncluded;
    if (req.query.acAvailable) filter.acAvailable = req.query.acAvailable;
    if (req.query.sharingType) filter.sharingType = req.query.sharingType;
    if (req.query.collegeNearby) filter.collegeNearby = req.query.collegeNearby;

    if (req.query.minRent || req.query.maxRent) {
      filter.rent = {};
      if (req.query.minRent) filter.rent.$gte = parseInt(req.query.minRent);
      if (req.query.maxRent) filter.rent.$lte = parseInt(req.query.maxRent);
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    options.sort = req.query.sort || '-createdAt';
    options.page = parseInt(req.query.page, 10) || 1;
    options.limit = parseInt(req.query.limit, 10) || 12;
    options.skip = (options.page - 1) * options.limit;

    const { data, total } = db.findAll('pgs', filter, options);

    const pagination = {};
    const endIndex = options.page * options.limit;
    if (endIndex < total) {
      pagination.next = { page: options.page + 1, limit: options.limit };
    }
    if (options.skip > 0) {
      pagination.prev = { page: options.page - 1, limit: options.limit };
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
    const pg = db.findById('pgs', req.params.id);
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
    const pg = db.create('pgs', req.body);
    res.status(201).json({ success: true, data: pg });
  } catch (err) {
    next(err);
  }
};

exports.updatePG = async (req, res, next) => {
  try {
    const pg = db.update('pgs', req.params.id, req.body);
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
    const pg = db.findById('pgs', req.params.id);
    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }
    db.delete('pgs', req.params.id);
    db.findAll('reviews', { pgId: req.params.id }).data.forEach(r => db.delete('reviews', r._id));
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedPGs = async (req, res, next) => {
  try {
    const { data } = db.findAll('pgs', { featured: true, active: true }, { limit: 6 });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getPGsByCollege = async (req, res, next) => {
  try {
    const { data } = db.findAll('pgs', { collegeNearby: req.params.college, active: true });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

exports.getSimilarPGs = async (req, res, next) => {
  try {
    const pg = db.findById('pgs', req.params.id);
    if (!pg) {
      return res.status(404).json({ success: false, message: 'PG not found' });
    }

    const { data } = db.findAll('pgs', {
      area: pg.area,
      gender: pg.gender,
      active: true
    }, { limit: 4 });

    const similar = data.filter(p => p._id !== pg._id).slice(0, 4);

    res.status(200).json({ success: true, data: similar });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const { total: totalPGs } = db.findAll('pgs', { active: true });
    const totalAreas = db.distinct('pgs', 'area');
    const avgResult = db.aggregate('pgs', [
      { $match: { active: true } },
      { $group: { _id: null, avgRent: { $avg: '$rent' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPGs,
        totalAreas: totalAreas.length,
        avgRent: avgResult.length > 0 ? Math.round(avgResult[0].avgRent) : 0
      }
    });
  } catch (err) {
    next(err);
  }
};
