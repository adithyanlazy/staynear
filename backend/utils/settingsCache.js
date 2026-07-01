const Settings = require('../models/Settings');

// Single cached Settings doc shared by all routes. Admin updates must call
// invalidateSettings() so public endpoints don't serve stale data for the TTL.
const cache = { data: null, ts: 0 };
const TTL = 60 * 1000;

const getSettings = async () => {
  const now = Date.now();
  if (cache.data && now - cache.ts < TTL) {
    return cache.data;
  }
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  cache.data = settings;
  cache.ts = now;
  return settings;
};

const invalidateSettings = () => {
  cache.data = null;
  cache.ts = 0;
};

module.exports = { getSettings, invalidateSettings };
