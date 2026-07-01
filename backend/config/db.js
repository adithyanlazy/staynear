const mongoose = require('mongoose');
const dns = require('dns');

// Windows + some networks (VPN/AV) block Node's UDP DNS queries needed for
// mongodb+srv:// lookups even though the OS resolver works fine. Forcing
// Node to use Google's DNS sidesteps that.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    // TLS for Atlas; plain connection for local mongodb:// so dev works offline
    const useTls = process.env.MONGODB_URI.startsWith('mongodb+srv://');
    const conn = await mongoose.connect(process.env.MONGODB_URI, useTls ? { tls: true } : {});
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
