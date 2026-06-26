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
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
