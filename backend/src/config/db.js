const mongoose = require('mongoose');
const createAdminUser = require('../utils/createAdmin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin user after database connection
    await createAdminUser();
    
    console.log(`📋 DobbyCo Database is ready!`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;