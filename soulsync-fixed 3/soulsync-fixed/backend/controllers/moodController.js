const Mood = require('../models/Mood');

const getToday = () => new Date().toISOString().split('T')[0];

const addMood = async (req, res, next) => {
  try {
    const { mood, emoji, note } = req.body;
    const entry = await Mood.findOneAndUpdate(
      { user: req.user._id, date: getToday() },
      { mood, emoji, note: note || '' },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json({ success: true, message: `Mood: ${mood} ${emoji}`, entry });
  } catch (error) { next(error); }
};

const getMoodHistory = async (req, res, next) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 }).limit(30).lean();
    res.json({ success: true, moods });
  } catch (error) { next(error); }
};

const getTodayMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOne({ user: req.user._id, date: getToday() });
    res.json({ success: true, mood: mood || null });
  } catch (error) { next(error); }
};

module.exports = { addMood, getMoodHistory, getTodayMood };
