require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const journalRoutes = require('./routes/journal');
const moodRoutes = require('./routes/mood');

connectDB();

const app = express();

// Fix: trust proxy BEFORE rate limiter (removes the warning)
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests.' },
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/journal', journalRoutes);
app.use('/mood', moodRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: '🦋 SoulSync running' });
});

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log('\n🦋 ══════════════════════════════════');
  console.log(`🦋  SoulSync Backend is RUNNING!`);
  console.log(`🦋  http://localhost:${PORT}`);
  console.log(`🦋  Groq Key: ${process.env.GROQ_API_KEY ? '✅ SET' : '❌ MISSING'}`);
  console.log(`🦋  MongoDB: ${process.env.MONGODB_URI}`);
  console.log('🦋 ══════════════════════════════════\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} busy! Run: npx kill-port ${PORT}\n`);
    process.exit(1);
  }
});
