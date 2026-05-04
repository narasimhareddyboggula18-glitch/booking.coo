const express = require('express');
const router = express.Router();
const { getAvailableSlots, createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.get('/slots',        protect, getAvailableSlots);
router.post('/',            protect, createBooking);
router.get('/my',           protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
