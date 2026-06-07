const { validationResult } = require('express-validator');
const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
};

// POST /api/admin/users
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, address, role });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error creating user' });
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else {
      order.push(['createdAt', 'DESC']);
    }

    const users = await User.findAll({ where, order });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = user.toJSON();

    // If user is a store owner, include their store rating
    if (user.role === 'store_owner') {
      const stores = await Store.findAll({
        where: { ownerId: user.id },
        include: [{
          model: Rating,
          as: 'ratings',
          attributes: [],
        }],
        attributes: {
          include: [
            [sequelize.fn('AVG', sequelize.col('ratings.rating')), 'averageRating'],
            [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'totalRatings'],
          ],
        },
        group: ['Store.id'],
      });
      userData.stores = stores;
    }

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// POST /api/admin/stores
const createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, ownerId } = req.body;

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ message: 'Store email already registered' });
    }

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner || owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'Invalid store owner' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId });

    res.status(201).json({
      message: 'Store created successfully',
      store,
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error creating store' });
  }
};

// GET /api/admin/stores
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const order = [];
    if (sortBy && sortBy !== 'rating') {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    }

    const stores = await Store.findAll({
      where,
      include: [{
        model: Rating,
        as: 'ratings',
        attributes: [],
      }],
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('ratings.rating')), 'averageRating'],
        ],
      },
      group: ['Store.id'],
      order,
    });

    // Handle sorting by rating in JS since it's a computed field
    let result = stores.map(s => s.toJSON());
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

module.exports = {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};
