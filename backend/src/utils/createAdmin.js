const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Create admin user
      const admin = await User.create({
        name: 'DobbyCo Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '+1234567890',
        address: {
          street: 'Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          zipCode: '00000',
          country: 'USA'
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      console.log('👑 Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = createAdminUser;