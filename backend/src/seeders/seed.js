const sequelize = require('../config/database');
const { User, Store, Rating } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database tables recreated (Old data cleared)');

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@ratehub.in',
      password: 'Admin@123',
      address: '101 Admin Block, Cyber City, Gurugram, Haryana 122002',
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);

    // Create store owners
    const owner1 = await User.create({
      name: 'Mukesh Ambani',
      email: 'mukesh@reliance.in',
      password: 'Owner@123',
      address: 'Antilia, Altamount Road, Cumballa Hill, Mumbai 400026',
      role: 'store_owner',
    });

    const owner2 = await User.create({
      name: 'Radhakishan Damani',
      email: 'rdamani@dmart.in',
      password: 'Owner@123',
      address: 'DMart Corporate Office, Powai, Mumbai, Maharashtra 400076',
      role: 'store_owner',
    });
    console.log('Store owners created');

    // Create normal users
    const user1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      password: 'User@123',
      address: 'Flat 402, Sunshine Apartments, Indiranagar, Bengaluru 560038',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@yahoo.in',
      password: 'User@123',
      address: '15/2 MG Road, Satellite, Ahmedabad, Gujarat 380015',
      role: 'user',
    });

    const user3 = await User.create({
      name: 'Amit Verma',
      email: 'amit.verma@outlook.com',
      password: 'User@123',
      address: 'Block C, Vasant Kunj, New Delhi, Delhi 110070',
      role: 'user',
    });
    console.log('Normal users created');

    // Create stores
    const store1 = await Store.create({
      name: 'Reliance Smart Bazaar',
      email: 'contact@smartbazaar.in',
      address: 'Phoenix Marketcity, LBS Marg, Kurla West, Mumbai 400070',
      ownerId: owner1.id,
    });

    const store2 = await Store.create({
      name: 'Reliance Digital',
      email: 'support@reliancedigital.in',
      address: 'Orion Mall, Brigade Gateway, Malleshwaram, Bengaluru 560055',
      ownerId: owner1.id,
    });

    const store3 = await Store.create({
      name: 'DMart Supermarket',
      email: 'customerservice@dmart.in',
      address: 'Sector 15, Near Galleria Market, Hiranandani, Powai, Mumbai 400076',
      ownerId: owner2.id,
    });

    const store4 = await Store.create({
      name: 'DMart Ready',
      email: 'online@dmart.in',
      address: 'Plot 22, Phase 1, Hinjewadi IT Park, Pune, Maharashtra 411057',
      ownerId: owner2.id,
    });
    console.log('Stores created');

    // Create ratings
    await Rating.bulkCreate([
      { userId: user1.id, storeId: store1.id, rating: 4 },
      { userId: user1.id, storeId: store2.id, rating: 5 },
      { userId: user1.id, storeId: store3.id, rating: 5 },
      { userId: user2.id, storeId: store1.id, rating: 4 },
      { userId: user2.id, storeId: store3.id, rating: 5 },
      { userId: user2.id, storeId: store4.id, rating: 3 },
      { userId: user3.id, storeId: store1.id, rating: 3 },
      { userId: user3.id, storeId: store2.id, rating: 4 },
      { userId: user3.id, storeId: store4.id, rating: 4 },
    ]);
    console.log('Ratings created');

    console.log('\n--- Seed Data Summary ---');
    console.log('Admin: admin@ratehub.in / Admin@123');
    console.log('Owner (Reliance): mukesh@reliance.in / Owner@123');
    console.log('Owner (DMart): rdamani@dmart.in / Owner@123');
    console.log('User1: rahul.sharma@gmail.com / User@123');
    console.log('User2: priya.patel@yahoo.in / User@123');
    console.log('User3: amit.verma@outlook.com / User@123');
    console.log('-------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
