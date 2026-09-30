const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getTodayChat, clearToday } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { chatRules, validate } = require('../middleware/validate');

router.use(protect);
router.post('/send', chatRules, validate, sendMessage);
router.get('/history', getChatHistory);
router.get('/today', getTodayChat);
router.delete('/clear', clearToday);

module.exports = router;
