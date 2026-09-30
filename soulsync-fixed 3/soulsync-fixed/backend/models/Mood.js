const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: ['Great', 'Good', 'Okay', 'Low', 'Loved'], required: true },
  emoji: { type: String, required: true },
  note: { type: String, default: '' },
  date: { type: String, required: true },
}, { timestamps: true });

moodSchema.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Mood', moodSchema);
