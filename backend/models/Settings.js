const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'StayNear'
  },
  siteDescription: {
    type: String,
    default: 'Find the best PG accommodations near your college in Mangalore'
  },
  contactEmail: {
    type: String,
    default: 'contact@staynear.com'
  },
  contactPhone: {
    type: String,
    default: '+91 9876543210'
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowRegistrations: {
    type: Boolean,
    default: true
  },
  maxImagesPerPG: {
    type: Number,
    default: 5
  },
  areas: {
    type: [String],
    default: ['Surathkal', 'Mangalore City', 'Bejai', 'Kankanady', 'Hampankatta', 'Kadri', 'Falnir', 'Boloor', 'Kapikad', 'Nanthoor', 'Valacchil', 'Moodbidri', 'Karkala', 'Udupi']
  },
  colleges: {
    type: [String],
    default: ['NITK Surathkal', 'St Aloysius College', 'Yenepoya University', 'Srinivas University', 'Canara Engineering College', 'AJ Institute', 'Mangalore University', 'SDM College', 'KMC Mangalore']
  },
  popularAreas: {
    type: [{
      name: { type: String, required: true },
      image: { type: String, default: '' }
    }],
    default: [
      { name: 'Surathkal', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
      { name: 'Hampankatta', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400' },
      { name: 'Kadri', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400' },
      { name: 'Bejai', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400' },
      { name: 'Kankanady', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' },
      { name: 'Falnir', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' }
    ]
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
