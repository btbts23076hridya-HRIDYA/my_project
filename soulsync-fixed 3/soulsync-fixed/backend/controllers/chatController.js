const Chat = require('../models/Chat');
const { getAIResponse } = require('../services/aiService');

const getToday = () => new Date().toISOString().split('T')[0];

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;
    const today = getToday();

    let session = await Chat.findOne({ user: userId, sessionDate: today });
    if (!session) session = new Chat({ user: userId, sessionDate: today, messages: [] });

    session.messages.push({ role: 'user', content: message });

    const history = session.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

    const aiText = await getAIResponse(message, history, {
      companionType: req.user.companionType,
      language: req.user.language,
      fullName: req.user.fullName,
    });

    if (!aiText) {
      return res.status(503).json({ success: false, message: 'AI service unavailable. Check API keys in .env' });
    }

    session.messages.push({ role: 'assistant', content: aiText });
    await session.save();

    res.json({
      success: true,
      userMessage: { role: 'user', content: message },
      aiMessage: { role: 'assistant', content: aiText },
    });
  } catch (error) { next(error); }
};

const getChatHistory = async (req, res, next) => {
  try {
    const sessions = await Chat.find({ user: req.user._id }).sort({ sessionDate: -1 }).limit(30).lean();
    res.json({ success: true, sessions });
  } catch (error) { next(error); }
};

const getTodayChat = async (req, res, next) => {
  try {
    const today = getToday();
    const session = await Chat.findOne({ user: req.user._id, sessionDate: today });
    res.json({ success: true, messages: session ? session.messages : [] });
  } catch (error) { next(error); }
};

const clearToday = async (req, res, next) => {
  try {
    await Chat.deleteOne({ user: req.user._id, sessionDate: getToday() });
    res.json({ success: true, message: 'Chat cleared.' });
  } catch (error) { next(error); }
};

module.exports = { sendMessage, getChatHistory, getTodayChat, clearToday };
