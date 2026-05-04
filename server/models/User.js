const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@presidencyuniversity\.in$/, 'Only @presidencyuniversity.in emails allowed'],
  },
  password:   { type: String, required: true, minlength: 6 },
  isVerified: { type: Boolean, default: false },
  role:       { type: String, enum: ['student','admin'], default: 'student' },
  otp:        { type: String },
  otpExpiry:  { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compare(pwd, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
