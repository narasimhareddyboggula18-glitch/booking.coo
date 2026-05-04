const Event = require('../models/Event');

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('sportId', 'name category')
      .sort({ startDate: -1 });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/events (admin)
exports.createEvent = async (req, res) => {
  try {
    const { eventName, sportId, startDate, endDate, description } = req.body;
    if (!eventName || !sportId || !startDate || !endDate)
      return res.status(400).json({ message: 'eventName, sportId, startDate, endDate required' });

    const event = await Event.create({
      eventName, sportId, startDate, endDate,
      description: description || '',
      createdBy: req.user._id,
    });
    await event.populate('sportId', 'name category');
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    console.error('createEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/events/:id (admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('sportId', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/events/:id (admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
