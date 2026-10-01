const nodemailer = require('nodemailer');

// Create transporter using Gmail
// Create transporter using explicit SMTP host and port 465
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Must be 16-character App Password
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds timeout instead of hanging
  });
};

// Beautiful HTML email template
const verificationEmailHTML = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#faf8ff;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:500px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(139,92,246,0.12);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#8b5cf6,#a855f7);padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">🦋</div>
      <h1 style="color:white;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">SoulSync</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Your Emotional Companion</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <h2 style="color:#2d1b69;font-size:22px;margin:0 0 12px;font-weight:800;">
        Hey ${name}! 👋
      </h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 28px;">
        Welcome to SoulSync! We're so happy you're here 💜<br>
        Please use the verification code below to complete your signup:
      </p>

      <!-- OTP Box -->
      <div style="background:linear-gradient(135deg,#f5f0ff,#fce7f3);border-radius:16px;padding:28px;text-align:center;margin:0 0 28px;border:2px solid #e5d8ff;">
        <p style="color:#7c3aed;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your Verification Code</p>
        <div style="font-size:48px;font-weight:800;letter-spacing:12px;color:#4c1d95;font-family:monospace;">${otp}</div>
        <p style="color:#9c7cc0;font-size:13px;margin:12px 0 0;">⏰ This code expires in <strong>3 minutes</strong></p>
      </div>

      <p style="color:#9c7cc0;font-size:13px;line-height:1.6;margin:0;">
        If you didn't create a SoulSync account, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#faf8ff;padding:20px 32px;text-align:center;border-top:1px solid #f0e8ff;">
      <p style="color:#c4b5fd;font-size:12px;margin:0;">Made with 💜 by SoulSync</p>
    </div>

  </div>
</body>
</html>
`;

const sendVerificationEmail = async (toEmail, name, otp) => {
  // If no email config, log OTP to console (for development)
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    console.log('\n📧 ══════════════════════════════════════');
    console.log('📧  EMAIL NOT CONFIGURED — Dev Mode');
    console.log(`📧  OTP for ${toEmail}: ${otp}`);
    console.log('📧 ══════════════════════════════════════\n');
    return { success: true, devMode: true };
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `SoulSync 🦋 <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `${otp} is your SoulSync verification code 🦋`,
      html: verificationEmailHTML(name, otp),
      text: `Hey ${name}! Your SoulSync verification code is: ${otp}. It expires in 3 minutes.`,
    });
    console.log(`📧 Verification email sent to ${toEmail}`);
    return { success: true, devMode: false };
  } catch (error) {
    console.error('📧 Email error:', error.message);
    // Don't fail signup if email fails — log OTP instead
    console.log(`📧 FALLBACK — OTP for ${toEmail}: ${otp}`);
    return { success: false, error: error.message };
  }
};

module.exports = { sendVerificationEmail };
