const { validationResult } = require('express-validator');
const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/stores - Normal user: list all stores with ratings
const getStores = async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const order = [];
    if (sortBy && sortBy !== 'rating') {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    }

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('ratings.rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'totalRatings'],
        ],
      },
      group: ['Store.id'],
      order,
    });

    // Get the current user's ratings for all stores
    const userRatings = await Rating.findAll({
      where: { userId },
      attributes: ['storeId', 'rating'],
    });

    const userRatingMap = {};
    userRatings.forEach(r => {
      userRatingMap[r.storeId] = r.rating;
    });

    const result = stores.map(s => {
      const storeData = s.toJSON();
      storeData.userRating = userRatingMap[storeData.id] || null;
      return storeData;
    });

    // Handle sorting by rating
    if (sortBy === 'rating') {
      result.sort((a, b) => {
        const aRating = a.averageRating || 0;
        const bRating = b.averageRating || 0;
        return sortOrder === 'desc' ? bRating - aRating : aRating - bRating;
      });
    }

    res.json({ stores: result });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error fetching stores' });
  }
};

// POST /api/stores/:storeId/rate - Submit or update rating
const rateStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Upsert: create or update
    const [ratingRecord, created] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: { rating, userId, storeId },
    });

    if (!created) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    }

    // Get updated average
    const result = await Rating.findAll({
      where: { storeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
      ],
    });

    res.json({
      message: created ? 'Rating submitted successfully' : 'Rating updated successfully',
      rating: ratingRecord,
      averageRating: result[0].dataValues.averageRating,
      totalRatings: result[0].dataValues.totalRatings,
    });
  } catch (error) {
    console.error('Rate store error:', error);
    res.status(500).json({ message: 'Server error submitting rating' });
  }
};

module.exports = { getStores, rateStore };
