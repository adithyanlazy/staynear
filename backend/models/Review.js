const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ReviewSchema.index({ pg: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (pgId) {
  const result = await this.aggregate([
    { $match: { pg: pgId } },
    { $group: { _id: '$pg', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  try {
    if (result.length > 0) {
      await this.model('PG').findByIdAndUpdate(pgId, {
        rating: Math.round(result[0].averageRating * 10) / 10,
        numReviews: result[0].count
      });
    } else {
      await this.model('PG').findByIdAndUpdate(pgId, {
        rating: 0,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.pg);
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.pg);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
