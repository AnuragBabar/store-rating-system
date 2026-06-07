const express = require('express');
const router = express.Router();
const { getStores, rateStore } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validators');

// All store routes require authentication + user role
router.use(authenticate, authorize('user'));

router.get('/', getStores);
router.post('/:storeId/rate', ratingValidation, rateStore);

module.exports = router;
