const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({ name, email, password, otp, otpExpiry });

    // Send OTP via email
    try {
      const { sendOTPEmail } = require('../utils/mailer');
      await sendOTPEmail(email, name, otp);
    } catch (mailErr) {
      console.error('Mail error (non-fatal):', mailErr.message);
    }

    res.status(201).json({
      message: 'Registration successful. Check your email for OTP.',
      email,
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: 'Email already registered' });
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ message: 'Email verified successfully', token, user });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email first' });

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      const { sendOTPEmail } = require('../utils/mailer');
      await sendOTPEmail(email, user.name, otp, true);
    } catch (e) { console.error('Mail error:', e.message); }

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
