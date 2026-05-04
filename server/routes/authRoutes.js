const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, getMe, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register',        register);
router.post('/login',           login);
router.post('/verify-email',    verifyEmail);
router.post('/forgot-password', forgotPassword);
router.get('/me',               protect, getMe);

module.exports = router;
