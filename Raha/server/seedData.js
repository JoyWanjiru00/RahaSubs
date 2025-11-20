const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SubscriptionTemplate = require('./models/SubscriptionTemplate');

dotenv.config();

const subscriptions = [
  {
    name: 'Netflix',
    icon: '🎬',
    monthlyPrice: 1500,
    maxUsers: 4,
  },
  {
    name: 'Spotify',
    icon: '🎵',
    monthlyPrice: 900,
    maxUsers: 6,
  },
  {
    name: 'Canva Pro',
    icon: '🎨',
    monthlyPrice: 1200,
    maxUsers: 5,
  },
  {
    name: 'Amazon Prime',
    icon: '📦',
    monthlyPrice: 800,
    maxUsers: 3,
  },
  {
    name: 'Showmax',
    icon: '📺',
    monthlyPrice: 1100,
    maxUsers: 4,
  },
  {
    name: 'YouTube Premium',
    icon: '▶️',
    monthlyPrice: 1000,
    maxUsers: 5,
  },
  {
    name: 'Disney+',
    icon: '🏰',
    monthlyPrice: 1300,
    maxUsers: 4,
  },
  {
    name: 'Adobe Creative Cloud',
    icon: '🖌️',
    monthlyPrice: 3500,
    maxUsers: 2,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing subscriptions
    await SubscriptionTemplate.deleteMany({});
    console.log('🗑️  Cleared existing subscriptions');

    // Insert new subscriptions
    await SubscriptionTemplate.insertMany(subscriptions);
    console.log('✅ Seeded subscription templates');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();