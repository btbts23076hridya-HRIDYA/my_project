const Journal = require('../models/Journal');

const createEntry = async (req, res, next) => {
  try {
    const { title, content, mood, moodEmoji, tags, gratitude } = req.body;
    const entry = await Journal.create({ user: req.user._id, title: title || '', content, mood: mood || '', moodEmoji: moodEmoji || '', tags: tags || [], gratitude: gratitude || '' });
    res.status(201).json({ success: true, message: 'Entry saved 📔', entry });
  } catch (error) { next(error); }
};

const getEntries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const entries = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await Journal.countDocuments({ user: req.user._id });
    res.json({ success: true, entries, pagination: { page, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

const getEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found.' });
    res.json({ success: true, entry });
  } catch (error) { next(error); }
};

const updateEntry = async (req, res, next) => {
  try {
    const { title, content, mood, moodEmoji, tags, gratitude } = req.body;
    const entry = await Journal.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { title, content, mood, moodEmoji, tags, gratitude }, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found.' });
    res.json({ success: true, entry });
  } catch (error) { next(error); }
};

const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found.' });
    res.json({ success: true, message: 'Entry deleted.' });
  } catch (error) { next(error); }
};

module.exports = { createEntry, getEntries, getEntry, updateEntry, deleteEntry };
