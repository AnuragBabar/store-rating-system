const express = require('express');
const router = express.Router();
const {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { userValidation, storeValidation } = require('../middleware/validators');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.post('/users', userValidation, createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/stores', storeValidation, createStore);
router.get('/stores', getStores);

module.exports = router;
