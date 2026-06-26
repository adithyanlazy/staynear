const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'StayNear'
  },
  siteLogo: {
    type: String,
    default: ''
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
  },
  happyStudents: {
    type: String,
    default: '2000+'
  },
  avgRating: {
    type: String,
    default: '4.5'
  },
  testimonials: {
    type: [{
      name: { type: String, required: true },
      college: { type: String, default: '' },
      rating: { type: Number, default: 5 },
      comment: { type: String, default: '' },
      avatar: { type: String, default: '' }
    }],
    default: [
      { name: 'Priya Sharma', college: 'NITK Surathkal', rating: 5, comment: 'Found my perfect PG through StayNear! The filters made it so easy to find exactly what I needed.', avatar: 'https://i.pravatar.cc/100?img=1' },
      { name: 'Arjun Reddy', college: 'St Aloysius College', rating: 5, comment: 'Best platform for students looking for PGs in Mangalore. Very user-friendly!', avatar: 'https://i.pravatar.cc/100?img=3' },
      { name: 'Sneha Patel', college: 'Yenepoya University', rating: 4, comment: 'Saved me so much time. I could compare prices and amenities easily.', avatar: 'https://i.pravatar.cc/100?img=5' }
    ]
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
