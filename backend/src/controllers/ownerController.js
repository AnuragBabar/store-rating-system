const { Store, Rating, User } = require('../models');
const sequelize = require('../config/database');

// GET /api/owner/dashboard
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get all stores owned by this user
    const stores = await Store.findAll({
      where: { ownerId },
      include: [{
        model: Rating,
        as: 'ratings',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        }],
      }],
    });

    // Calculate overall average rating across all stores
    const allRatings = [];
    const storeData = stores.map(store => {
      const storeJson = store.toJSON();
      const ratings = storeJson.ratings || [];
      ratings.forEach(r => allRatings.push(r.rating));

      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
        : 0;

      return {
        id: storeJson.id,
        name: storeJson.name,
        email: storeJson.email,
        address: storeJson.address,
        averageRating: parseFloat(avgRating),
        totalRatings: ratings.length,
        ratingUsers: ratings.map(r => ({
          id: r.user.id,
          name: r.user.name,
          email: r.user.email,
          rating: r.rating,
          ratedAt: r.createdAt,
        })),
      };
    });

    const overallAverage = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(2)
      : 0;

    res.json({
      stores: storeData,
      overallAverageRating: parseFloat(overallAverage),
      totalRatingsReceived: allRatings.length,
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching owner dashboard' });
  }
};

module.exports = { getOwnerDashboard };
