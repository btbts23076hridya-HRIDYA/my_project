const express = require('express');
const router = express.Router();
const {
  sendEmailOTP, verifyEmailOTP, signup, resendOTP, login, getMe, updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginRules, validate } = require('../middleware/validate');

router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTP);
router.post('/signup', signup);
router.post('/resend-otp', resendOTP);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;