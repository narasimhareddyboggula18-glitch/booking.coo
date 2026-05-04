const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName:   { type: String, required: true, trim: true },
  sportId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  startDate:   { type: Date, required: true },
  endDate:     { type: Date, required: true },
  description: { type: String, default: '' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
