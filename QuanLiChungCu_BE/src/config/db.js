const mongoose = require("mongoose");

const connectDB = async (options = {}) => {
  // allow override via parameter for tests; otherwise use env or sensible default
  const defaultUri = "mongodb://127.0.0.1:27017/qlchungcudb";
  const uri = process.env.MONGO_URI || defaultUri;

  try {
    await mongoose.connect(uri, {
      // Mongoose v8 has sane defaults; keep these for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options,
    });
    console.log(`✅ MongoDB Connected to ${uri}`);
    return mongoose.connection;
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    // If caller explicitly requests process exit on fail, do it; otherwise just throw
    if (process.env.DB_CRASH_ON_ERROR === 'true' || options.exitOnFail) {
      process.exit(1);
    }
    throw err;
  }
};

module.exports = connectDB;
