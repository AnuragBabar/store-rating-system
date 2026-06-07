const express = require('express');
const router = express.Router();
const { register, login, updatePassword, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation, passwordValidation } = require('../middleware/validators');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.put('/password', authenticate, passwordValidation, updatePassword);
router.get('/me', authenticate, getMe);

module.exports = router;
