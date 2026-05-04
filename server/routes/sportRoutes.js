const express = require('express');
const router = express.Router();
const { getAllSports, getSportById, getSportsByCategory } = require('../controllers/sportController');

router.get('/',             getAllSports);
router.get('/cat/:category', getSportsByCategory);
router.get('/:id',          getSportById);

module.exports = router;
