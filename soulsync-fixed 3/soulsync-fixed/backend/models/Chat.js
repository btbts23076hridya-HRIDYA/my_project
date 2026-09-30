const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionDate: { type: String, required: true },
  messages: [messageSchema],
}, { timestamps: true });

chatSchema.index({ user: 1, sessionDate: 1 });
module.exports = mongoose.model('Chat', chatSchema);
