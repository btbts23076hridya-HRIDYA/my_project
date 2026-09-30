const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName:      { type: String, required: false, trim: true, default: 'Pending' },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:      { type: String, required: true, select: false },
  language:      { type: String, enum: ['English', 'Hindi', 'Punjabi'], default: 'English' },
  avatar:        { type: String, default: '🦋' },
  gender:        { type: String, default: 'Prefer not to say' },
  companionType: { type: String, enum: ['Mentor', 'Best Friend', 'Buddy', 'Teacher'], default: 'Buddy' },
  streak:        { type: Number, default: 0 },
  lastActiveDate:{ type: Date, default: null },

  isVerified:      { type: Boolean, default: false },
  otp:             { type: String, select: false },
  otpExpires:      { type: Date, select: false },
  emailVerifiedAt: { type: Date, default: null },

}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password.startsWith('placeholder_')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.emailVerifiedAt;
  return obj;
};

module.exports = mongoose.model('User', userSchema);