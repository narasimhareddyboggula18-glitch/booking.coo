const Sport = require('../models/Sport');

// GET /api/sports
exports.getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json({ sports });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/sports/:id
exports.getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ message: 'Sport not found' });
    res.json({ sport });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/sports/outdoor  (handled via query)
exports.getSportsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const sports = await Sport.find({ category, isActive: true }).sort({ name: 1 });
    res.json({ sports });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
