const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const isEmailConfigured = () =>
  process.env.EMAIL_USER &&
  process.env.EMAIL_USER !== 'your_gmail@gmail.com' &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== 'your_16_digit_app_password';

// ── STEP 1: Send OTP to email only (before account creation) ──
const sendEmailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing.isVerified) {
      return res.status(400).json({ success: false, message: 'This email is already registered. Please sign in.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    if (existing) {
      existing.otp = otp;
      existing.otpExpires = otpExpires;
      await existing.save();
    } else {
      const placeholder = new User({
        fullName: 'Pending',
        email: normalizedEmail,
        password: 'placeholder_' + Date.now(),
        isVerified: false,
        otp,
        otpExpires,
      });
      await placeholder.save();
    }

    if (isEmailConfigured()) {
      await sendVerificationEmail(normalizedEmail, 'there', otp);
      return res.json({
        success: true,
        message: `Verification code sent to ${normalizedEmail}! Check your inbox 📧`,
        email: normalizedEmail,
      });
    } else {
      console.log(`\n📧 ══════════════════════════`);
      console.log(`📧 OTP for ${normalizedEmail}: ${otp}`);
      console.log(`📧 ══════════════════════════\n`);
      return res.json({
        success: true,
        message: 'Dev mode: OTP logged to backend console.',
        email: normalizedEmail,
      });
    }
  } catch (error) { next(error); }
};

// ── STEP 2: Verify OTP for email ─────────────────────────────
const verifyEmailOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpires');
    if (!user) {
      return res.status(400).json({ success: false, message: 'No OTP request found for this email.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'This email is already verified. Please sign in.' });
    }
    if (!user.otp || user.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect code. Please try again.' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Code has expired. Please request a new one.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.emailVerifiedAt = new Date();
    await user.save();

    return res.json({
      success: true,
      message: 'Email verified! ✅ Now complete your profile.',
      email: normalizedEmail,
    });
  } catch (error) { next(error); }
};

// ── STEP 3: Complete signup ───────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, language, avatar, gender, companionType } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Please verify your email first.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please sign in.' });
    }
    if (!user.emailVerifiedAt) {
      return res.status(400).json({ success: false, message: 'Please verify your email with OTP first.' });
    }

    user.fullName = fullName.trim();
    user.password = password;
    user.language = language || 'English';
    user.avatar = avatar || '🦋';
    user.gender = gender || 'Prefer not to say';
    user.companionType = companionType || 'Buddy';
    user.isVerified = true;
    user.emailVerifiedAt = undefined;
    await user.save();

    const token = generateToken(user._id);
    console.log(`✅ New user registered: ${normalizedEmail}`);

    res.status(201).json({
      success: true,
      message: `Welcome to SoulSync, ${user.fullName}! 🦋`,
      token,
      user: user.toSafeObject(),
    });
  } catch (error) { next(error); }
};

// ── RESEND OTP ───────────────────────────────────────────────
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(400).json({ success: false, message: 'No account with this email.' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Already verified. Please sign in.' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    if (isEmailConfigured()) {
      await sendVerificationEmail(normalizedEmail, user.fullName || 'there', otp);
    } else {
      console.log(`\n📧 New OTP for ${normalizedEmail}: ${otp}\n`);
    }

    res.json({
      success: true,
      message: isEmailConfigured() ? 'New code sent! Check your email 📧' : 'Dev mode: New OTP logged to backend console.',
    });
  } catch (error) { next(error); }
};

// ── LOGIN ────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'No account found with this email.' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Incorrect password.' });

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please complete your signup first.',
        requiresVerification: true,
        email,
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const last = user.lastActiveDate ? new Date(user.lastActiveDate).toISOString().split('T')[0] : null;
    if (last !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      user.streak = last === yesterday.toISOString().split('T')[0] ? user.streak + 1 : 1;
      user.lastActiveDate = new Date();
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({ success: true, message: `Welcome back, ${user.fullName}! 💜`, token, user: user.toSafeObject() });
  } catch (error) { next(error); }
};

// ── GET ME ───────────────────────────────────────────────────
const getMe = async (req, res) => res.json({ success: true, user: req.user });

// ── UPDATE PROFILE ───────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['fullName', 'language', 'avatar', 'gender', 'companionType'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'Profile updated! 💜', user: user.toSafeObject() });
  } catch (error) { next(error); }
};

module.exports = { sendEmailOTP, verifyEmailOTP, signup, resendOTP, login, getMe, updateProfile };