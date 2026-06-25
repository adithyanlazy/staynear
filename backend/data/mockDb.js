const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

class MockDB {
  constructor() {
    this.pgs = [];
    this.users = [];
    this.reviews = [];
    this.settings = {
      siteName: 'StayNear',
      siteDescription: 'Find the best PG accommodations near your college in Mangalore',
      contactEmail: 'contact@staynear.com',
      contactPhone: '+91 9876543210',
      maintenanceMode: false,
      allowRegistrations: true,
      maxImagesPerPG: 5,
    };
    this.nextUserId = 1;
    this.nextReviewId = 1;
    this.persistPath = path.join(__dirname, 'persist.json');
    this.loadData();
  }

  loadData() {
    if (this.loadPersisted()) {
      console.log(`Restored persisted data: ${this.users.length} users, ${this.pgs.length} PGs, ${this.reviews.length} reviews`);
      return;
    }

    try {
      const pgsPath = path.join(__dirname, 'pgs.json');
      const pgsData = fs.readFileSync(pgsPath, 'utf-8');
      this.pgs = JSON.parse(pgsData);
      console.log(`Loaded ${this.pgs.length} PGs from mock data`);
    } catch (error) {
      console.error('Error loading mock data:', error);
      this.pgs = [];
    }

    this.seedAdminSync();
    this.save();
  }

  loadPersisted() {
    try {
      if (!fs.existsSync(this.persistPath)) return false;
      const raw = fs.readFileSync(this.persistPath, 'utf-8');
      const data = JSON.parse(raw);
      this.pgs = data.pgs || [];
      this.users = data.users || [];
      this.reviews = data.reviews || [];
      if (data.settings) this.settings = data.settings;
      return this.users.length > 0 || this.pgs.length > 0;
    } catch {
      return false;
    }
  }

  save() {
    try {
      fs.writeFileSync(this.persistPath, JSON.stringify({
        pgs: this.pgs,
        users: this.users,
        reviews: this.reviews,
        settings: this.settings,
      }, null, 2));
    } catch (err) {
      console.error('Failed to persist data:', err);
    }
  }

  seedAdminSync() {
    const adminExists = this.users.some(u => u.role === 'admin');
    if (adminExists) return;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);

    const admin = {
      _id: this.generateId('us'),
      name: 'Admin',
      email: 'admin@staynear.com',
      password: hashedPassword,
      role: 'admin',
      favorites: [],
      emailVerified: true,
      createdAt: new Date().toISOString(),
      active: true,
    };

    this.users.push(admin);
    console.log('Seeded admin user: admin@staynear.com / admin123');
  }

  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  findAll(collection, filter = {}, options = {}) {
    let data = [...this[collection]];
    
    if (filter.area) {
      data = data.filter(item => item.area === filter.area);
    }
    if (filter.gender) {
      data = data.filter(item => item.gender === filter.gender);
    }
    if (filter.foodIncluded !== undefined && filter.foodIncluded !== '') {
      data = data.filter(item => item.foodIncluded === (filter.foodIncluded === 'true'));
    }
    if (filter.acAvailable !== undefined && filter.acAvailable !== '') {
      data = data.filter(item => item.acAvailable === (filter.acAvailable === 'true'));
    }
    if (filter.sharingType) {
      data = data.filter(item => item.sharingType === filter.sharingType);
    }
    if (filter.collegeNearby) {
      data = data.filter(item => item.collegeNearby.includes(filter.collegeNearby));
    }
    if (filter.featured !== undefined) {
      data = data.filter(item => item.featured === filter.featured);
    }
    if (filter.active !== undefined) {
      data = data.filter(item => item.active === filter.active);
    }
    if (filter.email) {
      data = data.filter(item => item.email === filter.email);
    }
    if (filter.phone) {
      data = data.filter(item => item.phone === filter.phone);
    }
    if (filter.role) {
      data = data.filter(item => item.role === filter.role);
    }
    if (filter.rent) {
      if (filter.rent.$gte !== undefined) {
        data = data.filter(item => item.rent >= filter.rent.$gte);
      }
      if (filter.rent.$lte !== undefined) {
        data = data.filter(item => item.rent <= filter.rent.$lte);
      }
    }
    if (filter.$text && filter.$text.$search) {
      const search = filter.$text.$search.toLowerCase();
      data = data.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.area.toLowerCase().includes(search)
      );
    }
    if (filter._id && filter._id.$ne) {
      data = data.filter(item => item._id !== filter._id.$ne);
    }

    if (options.sort) {
      const sortField = options.sort.replace('-', '');
      const sortDir = options.sort.startsWith('-') ? -1 : 1;
      data.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortDir;
        if (a[sortField] > b[sortField]) return 1 * sortDir;
        return 0;
      });
    } else {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = data.length;

    if (options.skip) {
      data = data.slice(options.skip);
    }
    if (options.limit) {
      data = data.slice(0, options.limit);
    }

    return { data, total };
  }

  findById(collection, id) {
    return this[collection].find(item => item._id === id) || null;
  }

  findByText(collection, searchText, fields = ['name', 'description', 'area']) {
    const search = searchText.toLowerCase();
    return this[collection].filter(item => 
      fields.some(field => item[field] && item[field].toLowerCase().includes(search))
    );
  }

  create(collection, data) {
    const newItem = {
      ...data,
      _id: this.generateId(collection.slice(0, 2)),
      createdAt: new Date().toISOString(),
      rating: 0,
      numReviews: 0,
      active: true
    };
    this[collection].push(newItem);
    this.save();
    return newItem;
  }

  update(collection, id, data) {
    const index = this[collection].findIndex(item => item._id === id);
    if (index === -1) return null;
    this[collection][index] = { ...this[collection][index], ...data };
    this.save();
    return this[collection][index];
  }

  delete(collection, id) {
    const index = this[collection].findIndex(item => item._id === id);
    if (index === -1) return false;
    this[collection].splice(index, 1);
    this.save();
    return true;
  }

  distinct(collection, field) {
    const values = this[collection].map(item => item[field]);
    return [...new Set(values.flat())];
  }

  getSettings() {
    return { ...this.settings };
  }

  updateSettings(data) {
    this.settings = { ...this.settings, ...data };
    this.save();
    return this.getSettings();
  }

  aggregate(collection, pipeline) {
    let data = [...this[collection]];
    
    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter(item => {
          return Object.entries(stage.$match).every(([key, value]) => {
            if (typeof value === 'object' && value.$ne !== undefined) {
              return item[key] !== value.$ne;
            }
            return item[key] === value;
          });
        });
      }
      if (stage.$group) {
        const groups = {};
        data.forEach(item => {
          const key = stage.$group._id ? item[stage.$group._id.replace('$', '')] : 'all';
          if (!groups[key]) groups[key] = { _id: key, items: [] };
          groups[key].items.push(item);
        });
        
        return Object.values(groups).map(group => {
          const result = { _id: group._id };
          Object.entries(stage.$group).forEach(([field, op]) => {
            if (field === '_id') return;
            if (op.$avg) {
              const values = group.items.map(i => i[op.$avg.replace('$', '')]);
              result[field] = values.reduce((a, b) => a + b, 0) / values.length;
            }
            if (op.$sum) {
              if (op.$sum === 1) {
                result[field] = group.items.length;
              }
            }
          });
          return result;
        });
      }
    }
    
    return data;
  }
}

const db = new MockDB();
module.exports = db;
