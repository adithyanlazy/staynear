// Approximate campus coordinates for Mangalore colleges. Distances shown
// with "~" since both these and PG pins are approximate.
export const COLLEGE_COORDS = {
  'NITK Surathkal': { lat: 13.0108, lng: 74.7943 },
  'St Aloysius College': { lat: 12.8703, lng: 74.8425 },
  'Yenepoya University': { lat: 12.8082, lng: 74.8806 },
  'Srinivas University': { lat: 12.8563, lng: 74.8329 },
  'Canara Engineering College': { lat: 12.8905, lng: 74.9856 },
  'AJ Institute': { lat: 12.8894, lng: 74.856 },
  'Mangalore University': { lat: 12.8156, lng: 74.926 },
  'SDM College': { lat: 12.871, lng: 74.842 },
  'KMC Mangalore': { lat: 12.865, lng: 74.842 },
};

const toRad = (deg) => (deg * Math.PI) / 180;

// Haversine, returns km
export const distanceKm = (a, b) => {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const formatKm = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`);

// Nearest known college among the PG's collegeNearby list.
// Returns { college, km, label } or null when coords are missing.
export const nearestCollege = (pg) => {
  if (!pg?.location?.lat || !pg?.location?.lng || !pg.collegeNearby?.length) return null;
  let best = null;
  for (const college of pg.collegeNearby) {
    const coords = COLLEGE_COORDS[college];
    if (!coords) continue;
    const km = distanceKm(pg.location, coords);
    if (!best || km < best.km) best = { college, km };
  }
  if (!best) return null;
  return { ...best, label: `~${formatKm(best.km)} from ${best.college}` };
};

// Distance to one specific college, or null.
export const distanceToCollege = (pg, college) => {
  const coords = COLLEGE_COORDS[college];
  if (!coords || !pg?.location?.lat || !pg?.location?.lng) return null;
  return `~${formatKm(distanceKm(pg.location, coords))}`;
};
