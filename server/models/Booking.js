const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sportId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  date:        { type: Date, required: true },
  timeSlot: {
    start: { type: String, required: true },
    end:   { type: String, required: true },
  },
  status:      { type: String, enum: ['upcoming','completed','cancelled'], default: 'upcoming' },
  courtNumber: { type: Number, default: 1 },
}, { timestamps: true });

// Compound unique: same sport + date + timeslot + court = no duplicate
bookingSchema.index(
  { sportId: 1, date: 1, 'timeSlot.start': 1, courtNumber: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

module.exports = mongoose.model('Booking', bookingSchema);
