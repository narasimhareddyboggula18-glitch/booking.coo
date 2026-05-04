const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  category:    { type: String, enum: ['outdoor','indoor'], required: true },
  image:       { type: String, default: '' },
  courtCount:  { type: Number, default: 1 },
  isActive:    { type: Boolean, default: true },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
