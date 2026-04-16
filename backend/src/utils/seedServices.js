const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');

dotenv.config();

const services = [
  {
    name: "Premium Dog Grooming",
    category: "grooming",
    description: "Full grooming service including bath, haircut, nail trimming, ear cleaning, and teeth brushing. Uses premium organic products that are safe for sensitive skin.",
    price: 49.99,
    duration: "1hour",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500",
    features: ["Organic shampoos", "Nail clipping", "Ear cleaning", "Teeth brushing", "Style haircut", "Paw balm treatment"],
    isAvailable: true
  },
  {
    name: "Luxury Cat Spa",
    category: "grooming",
    description: "Gentle grooming for cats including brushing, nail trim, ear cleaning, and stress-free bath with calming techniques.",
    price: 44.99,
    duration: "1hour",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500",
    features: ["Gentle handling", "Nail trim", "Ear cleaning", "Luxury bath", "Brushing", "Calming spray"],
    isAvailable: true
  },
  {
    name: "Veterinary Health Checkup",
    category: "vet",
    description: "Complete health checkup by licensed veterinarian. Includes physical examination, weight check, and health certificate.",
    price: 79.99,
    duration: "30min",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500",
    features: ["Physical exam", "Vaccination check", "Health certificate", "Expert advice", "Weight monitoring"],
    isAvailable: true
  },
  {
    name: "24/7 Emergency Vet Care",
    category: "vet",
    description: "Round-the-clock emergency veterinary services for urgent medical needs. Immediate attention for critical cases.",
    price: 149.99,
    duration: "1hour",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500",
    features: ["Emergency response", "Critical care", "Diagnostics", "24/7 availability", "ICU facilities"],
    isAvailable: true
  },
  {
    name: "Premium Daycare",
    category: "daycare",
    description: "Full-day daycare with indoor/outdoor play areas, socialization, supervised naps, and healthy meals included. Live webcam access available.",
    price: 35.99,
    duration: "full-day",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500",
    features: ["Indoor/outdoor play", "Socialization", "Supervised naps", "Meals included", "Webcam access", "Daily report card"],
    isAvailable: true
  },
  {
    name: "Luxury Overnight Boarding",
    category: "boarding",
    description: "Comfortable overnight stay with individual suites, climate control, bedtime stories, and morning walks. 24/7 staff supervision.",
    price: 59.99,
    duration: "overnight",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
    features: ["Private suite", "Climate control", "Bedtime stories", "Morning walks", "24/7 care", "Blanket from home allowed"],
    isAvailable: true
  },
  {
    name: "Professional Dog Walking",
    category: "walking",
    description: "30-minute walks with certified professional dog walkers. GPS tracked with real-time updates and photos sent to your phone.",
    price: 24.99,
    duration: "30min",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
    features: ["GPS tracked", "Photo updates", "Professional walker", "Water breaks", "Poop bags included", "Weather appropriate"],
    isAvailable: true
  },
  {
    name: "Basic Obedience Training",
    category: "training",
    description: "6-session basic to advanced obedience training. Learn sit, stay, come, down, and loose-leash walking.",
    price: 89.99,
    duration: "1hour",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500",
    features: ["Basic commands", "Leash training", "Socialization", "Certificate", "Take-home materials", "Follow-up support"],
    isAvailable: true
  },
  {
    name: "Puppy Training Program",
    category: "training",
    description: "Specialized 8-week training for puppies aged 8-16 weeks. House training, socialization, bite inhibition, and basic commands.",
    price: 99.99,
    duration: "1hour",
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500",
    features: ["House training", "Socialization", "Bite inhibition", "Basic commands", "Puppy playtime", "Owner education"],
    isAvailable: true
  }
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing services
    const deleted = await Service.deleteMany({});
    console.log(`🗑️ Cleared ${deleted.deletedCount} existing services`);
    
    // Insert new services
    const inserted = await Service.insertMany(services);
    console.log(`✅ Added ${inserted.length} services to database`);
    
    console.log('\n📋 Services added:');
    console.log('━'.repeat(50));
    inserted.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   Category: ${service.category} | Price: $${service.price} | Duration: ${service.duration}`);
      console.log(`   Features: ${service.features.length} features`);
      console.log('');
    });
    
    console.log('━'.repeat(50));
    console.log('🎉 Database seeded successfully!');
    console.log('\n💡 Restart your backend with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();