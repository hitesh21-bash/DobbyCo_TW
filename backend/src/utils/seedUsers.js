const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const users = [
  {
    name: "John Doe",
    email: "user@example.com",
    password: "password123",
    phone: "+1 (555) 123-4567",
    role: "user",
    address: {
      street: "123 Pet Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    pets: [
      {
        name: "Max",
        type: "dog",
        breed: "Golden Retriever",
        age: 3,
        weight: 32,
        medicalConditions: "None"
      },
      {
        name: "Bella",
        type: "cat",
        breed: "Persian",
        age: 2,
        weight: 4,
        medicalConditions: "None"
      }
    ]
  },
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    phone: "+1 (555) 987-6543",
    role: "user",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    pets: [
      {
        name: "Luna",
        type: "cat",
        breed: "Siamese",
        age: 4,
        weight: 3.5,
        medicalConditions: "Allergic to chicken"
      },
      {
        name: "Charlie",
        type: "dog",
        breed: "Beagle",
        age: 5,
        weight: 12,
        medicalConditions: "None"
      }
    ]
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    phone: "+1 (555) 456-7890",
    role: "user",
    address: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    pets: [
      {
        name: "Rocky",
        type: "dog",
        breed: "German Shepherd",
        age: 2,
        weight: 38,
        medicalConditions: "None"
      }
    ]
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    password: "password123",
    phone: "+1 (555) 321-0987",
    role: "user",
    address: {
      street: "321 Maple Drive",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    pets: [
      {
        name: "Coco",
        type: "bird",
        breed: "Cockatiel",
        age: 1,
        weight: 0.1,
        medicalConditions: "None"
      },
      {
        name: "Mochi",
        type: "rabbit",
        breed: "Holland Lop",
        age: 1,
        weight: 2,
        medicalConditions: "None"
      }
    ]
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    let createdCount = 0;
    let existingCount = 0;
    
    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Create user (password will be hashed by the pre-save middleware)
        await User.create(userData);
        console.log(`✅ Created user: ${userData.email} (${userData.name})`);
        createdCount++;
      } else {
        console.log(`⚠️ User already exists: ${userData.email}`);
        existingCount++;
      }
    }
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: "DobbyCo Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        phone: "+1 (555) 000-0000",
        role: "admin",
        address: {
          street: "Admin Office",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "USA"
        },
        pets: []
      });
      console.log(`✅ Created admin user: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log(`⚠️ Admin user already exists: ${process.env.ADMIN_EMAIL}`);
    }
    
    console.log('\n' + '━'.repeat(60));
    console.log('🎉 DATABASE SEEDING COMPLETE!');
    console.log('━'.repeat(60));
    console.log(`📊 Summary: ${createdCount} new users created, ${existingCount} already existed`);
    console.log('\n🔐 DEMO LOGIN CREDENTIALS:');
    console.log('━'.repeat(40));
    console.log('📧 Regular Users:');
    console.log('   user@example.com     → password: password123');
    console.log('   sarah@example.com    → password: password123');
    console.log('   mike@example.com     → password: password123');
    console.log('   emma@example.com     → password: password123');
    console.log('\n👑 Admin Access:');
    console.log(`   ${process.env.ADMIN_EMAIL} → password: ${process.env.ADMIN_PASSWORD}`);
    console.log('━'.repeat(40));
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your backend: npm run dev');
    console.log('   2. Visit http://localhost:5173');
    console.log('   3. Login with any of the credentials above');
    console.log('   4. Browse services and make bookings!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

seedUsers();