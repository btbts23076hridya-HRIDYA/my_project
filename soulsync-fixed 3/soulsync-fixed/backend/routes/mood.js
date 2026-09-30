const express = require('express');
const router = express.Router();
const { addMood, getMoodHistory, getTodayMood } = require('../controllers/moodController');
const { protect } = require('../middleware/auth');
const { moodRules, validate } = require('../middleware/validate');

router.use(protect);
router.post('/add', moodRules, validate, addMood);
router.get('/history', getMoodHistory);
router.get('/today', getTodayMood);

module.exports = router;
