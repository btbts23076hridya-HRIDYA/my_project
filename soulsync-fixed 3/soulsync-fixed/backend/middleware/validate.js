const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
  next();
};

const signupRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ min: 2 }),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars').matches(/\d/).withMessage('Password needs a number'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
];

const chatRules = [
  body('message').trim().notEmpty().withMessage('Message required').isLength({ max: 1000 }),
];

const journalRules = [
  body('content').trim().notEmpty().withMessage('Content required').isLength({ max: 5000 }),
];

const moodRules = [
  body('mood').notEmpty().isIn(['Great', 'Good', 'Okay', 'Low', 'Loved']),
  body('emoji').notEmpty(),
];

module.exports = { validate, signupRules, loginRules, chatRules, journalRules, moodRules };
