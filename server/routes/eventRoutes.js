const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',       getEvents);
router.post('/',      protect, adminOnly, createEvent);
router.patch('/:id',  protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;
