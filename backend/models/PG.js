const mongoose = require('mongoose');

const PGSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a PG name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  rent: {
    type: Number,
    required: [true, 'Please add rent amount']
  },
  deposit: {
    type: Number,
    required: [true, 'Please add deposit amount']
  },
  gender: {
    type: String,
    enum: ['boys', 'girls', 'co-ed'],
    required: [true, 'Please specify gender preference']
  },
  foodIncluded: {
    type: Boolean,
    default: false
  },
  acAvailable: {
    type: Boolean,
    default: false
  },
  sharingType: {
    type: String,
    enum: ['single', 'double', 'triple', 'multiple'],
    required: [true, 'Please specify sharing type']
  },
  area: {
    type: String,
    required: [true, 'Please add area']
  },
  collegeNearby: [{
    type: String
  }],
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  latitude: {
    type: Number,
    required: [true, 'Please add latitude']
  },
  longitude: {
    type: Number,
    required: [true, 'Please add longitude']
  },
  images: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  contactNumber: {
    type: String,
    required: [true, 'Please add contact number']
  },
  contactName: {
    type: String,
    default: 'Owner'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PGSchema.index({ name: 'text', description: 'text', area: 'text' });
PGSchema.index({ area: 1, gender: 1, rent: 1 });
PGSchema.index({ collegeNearby: 1 });

module.exports = mongoose.model('PG', PGSchema);
