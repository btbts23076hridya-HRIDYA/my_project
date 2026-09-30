const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  mood: { type: String, default: '' },
  moodEmoji: { type: String, default: '' },
  tags: { type: [String], default: [] },
  gratitude: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
