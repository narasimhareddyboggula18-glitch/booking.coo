const Booking = require('../models/Booking');
const User = require('../models/User');
const Sport = require('../models/Sport');
const { startOfDay, endOfDay } = require('date-fns');

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const [totalBookings, todayBookings, totalUsers, activeSports] = await Promise.all([
      Booking.countDocuments({ status: { $ne: 'cancelled' } }),
      Booking.countDocuments({
        date: { $gte: startOfDay(today), $lte: endOfDay(today) },
        status: { $ne: 'cancelled' },
      }),
      User.countDocuments({ isVerified: true }),
      Sport.countDocuments({ isActive: true }),
    ]);

    // Bookings per sport
    const sportStats = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$sportId', count: { $sum: 1 } } },
      { $lookup: { from: 'sports', localField: '_id', foreignField: '_id', as: 'sport' } },
      { $unwind: '$sport' },
      { $project: { sportName: '$sport.name', count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.json({ totalBookings, todayBookings, totalUsers, activeSports, sportStats });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('sportId', 'name category')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
