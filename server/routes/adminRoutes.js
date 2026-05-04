const express = require('express');
const router = express.Router();
const { getDashboard, getAllBookings, getAllUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/bookings',  getAllBookings);
router.get('/users',     getAllUsers);

module.exports = router;
