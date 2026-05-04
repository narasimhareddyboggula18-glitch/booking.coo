const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Sport = require('../models/Sport');
const { startOfDay, endOfDay, addHours } = require('date-fns');

const ALL_SLOTS = [
  { start: '09:30', end: '10:30' },
  { start: '10:30', end: '11:30' },
  { start: '11:30', end: '12:30' },
  { start: '12:30', end: '13:30' },
  { start: '13:30', end: '14:30' },
  { start: '14:30', end: '15:30' },
  { start: '15:30', end: '16:30' },
  { start: '16:30', end: '17:00' },
];

// GET /api/bookings/slots?sportId=&date=
exports.getAvailableSlots = async (req, res) => {
  try {
    const { sportId, date } = req.query;
    if (!sportId || !date) return res.status(400).json({ message: 'sportId and date required' });

    const dayStart = startOfDay(new Date(date));
    const dayEnd   = endOfDay(new Date(date));

    // Check if event blocks this sport on this date
    const event = await Event.findOne({
      sportId, isActive: true,
      startDate: { $lte: dayEnd },
      endDate:   { $gte: dayStart },
    });

    if (event) {
      return res.json({
        slots: ALL_SLOTS,
        bookedSlots: [],
        blockedByEvent: true,
        eventName: event.eventName,
      });
    }

    // Get existing bookings for this sport+date
    const existingBookings = await Booking.find({
      sportId,
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: 'cancelled' },
    });

    const bookedSlots = existingBookings.map(b => ({
      start: b.timeSlot.start,
      end:   b.timeSlot.end,
      courtNumber: b.courtNumber,
    }));

    res.json({ slots: ALL_SLOTS, bookedSlots, blockedByEvent: false, eventName: null });
  } catch (err) {
    console.error('getAvailableSlots error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { sportId, date, timeSlot } = req.body;
    const userId = req.user._id;

    if (!sportId || !date || !timeSlot?.start || !timeSlot?.end)
      return res.status(400).json({ message: 'sportId, date, and timeSlot are required' });

    const bookingDate = new Date(date);
    const today = startOfDay(new Date());

    // Past date check
    if (bookingDate < today)
      return res.status(400).json({ message: 'Cannot book past dates' });

    // Sunday check
    if (bookingDate.getDay() === 0)
      return res.status(400).json({ message: 'No bookings on Sundays' });

    // Event block check
    const event = await Event.findOne({
      sportId, isActive: true,
      startDate: { $lte: endOfDay(bookingDate) },
      endDate:   { $gte: startOfDay(bookingDate) },
    });
    if (event)
      return res.status(400).json({ message: `Blocked: ${event.eventName} is in progress` });

    // Max 2 bookings per day per user
    const userDayBookings = await Booking.countDocuments({
      userId,
      date: { $gte: startOfDay(bookingDate), $lte: endOfDay(bookingDate) },
      status: { $ne: 'cancelled' },
    });
    if (userDayBookings >= 2)
      return res.status(400).json({ message: 'Max 2 bookings per day allowed' });

    // Find sport for court count
    const sport = await Sport.findById(sportId);
    if (!sport) return res.status(404).json({ message: 'Sport not found' });

    // Find available court
    const takenCourts = await Booking.find({
      sportId,
      date: { $gte: startOfDay(bookingDate), $lte: endOfDay(bookingDate) },
      'timeSlot.start': timeSlot.start,
      status: { $ne: 'cancelled' },
    }).select('courtNumber');

    const takenNums = takenCourts.map(b => b.courtNumber);
    let courtNumber = null;
    for (let c = 1; c <= (sport.courtCount || 1); c++) {
      if (!takenNums.includes(c)) { courtNumber = c; break; }
    }
    if (!courtNumber)
      return res.status(400).json({ message: 'All courts are booked for this slot' });

    const booking = await Booking.create({
      userId, sportId, date: bookingDate, timeSlot, courtNumber,
    });

    await booking.populate(['userId', 'sportId']);
    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'This slot is already booked' });
    console.error('createBooking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const { status, sport } = req.query;
    const filter = { userId: req.user._id };
    if (status && status !== 'all') filter.status = status;

    let bookings = await Booking.find(filter)
      .populate('sportId', 'name category image')
      .sort({ date: -1, createdAt: -1 });

    if (sport) bookings = bookings.filter(b => b.sportId?.name === sport);

    // Auto-mark completed past bookings
    const now = new Date();
    for (const b of bookings) {
      if (b.status === 'upcoming' && new Date(b.date) < startOfDay(now)) {
        b.status = 'completed';
        await b.save();
      }
    }

    res.json({ bookings });
  } catch (err) {
    console.error('getMyBookings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'upcoming')
      return res.status(400).json({ message: 'Only upcoming bookings can be cancelled' });

    // 2-hour advance cancel rule
    const [h, m] = booking.timeSlot.start.split(':').map(Number);
    const slotTime = new Date(booking.date);
    slotTime.setHours(h, m, 0, 0);
    if (new Date() > addHours(slotTime, -2))
      return res.status(400).json({ message: 'Cannot cancel within 2 hours of the slot' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    console.error('cancelBooking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
