import { useState, useRef } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AVATARS = [
  { emoji: '🌸', bg: '#ffd6e7' }, { emoji: '🌿', bg: '#d6f5e0' },
  { emoji: '🌊', bg: '#d6eeff' }, { emoji: '🌙', bg: '#e8d6ff' },
  { emoji: '☀️', bg: '#fff3d6' }, { emoji: '🦋', bg: '#e8d6ff' },
  { emoji: '🌺', bg: '#ffd6e7' }, { emoji: '⭐', bg: '#fff3d6' },
];

const COMPANIONS = [
  { icon: '🧭', label: 'Mentor',      desc: 'Wise guidance and thoughtful advice',    bg: '#f0e8ff' },
  { icon: '💜', label: 'Best Friend', desc: 'Always there to listen and support',      bg: '#ffd6e7' },
  { icon: '🤝', label: 'Buddy',       desc: 'Cheerful companion for everyday moments', bg: '#fff3d6' },
  { icon: '📚', label: 'Teacher',     desc: 'Patient learning and personal growth',    bg: '#d6f5e0' },
];

const LANGS = [
  { code: 'EN', name: 'English', native: 'English' },
  { code: 'HI', name: 'Hindi',   native: 'हिन्दी'   },
  { code: 'PA', name: 'Punjabi', native: 'ਪੰਜਾਬੀ'  },
];

const GENDERS = [
  { label: 'Male',              emoji: '👦' },
  { label: 'Female',            emoji: '👧' },
  { label: 'Non-binary',        emoji: '🧒' },
  { label: 'Prefer not to say', emoji: '🤍' },
];

const Dots = ({ active, total = 4 }) => (
  <div className="step-dots">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`step-dot ${i === active ? 'active' : ''}`} />
    ))}
  </div>
);

// ── 6-box OTP Input ──────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = [...digits];
      if (next[idx] !== ' ') { next[idx] = ' '; onChange(next.join('').trim()); }
      else if (idx > 0) { inputs.current[idx - 1]?.focus(); }
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    if (!val) return;
    const next = [...digits];
    next[idx] = val;
    onChange(next.join('').replace(/ /g, ''));
    if (idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '24px 0' }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input key={i}
          ref={el => inputs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i] === ' ' ? '' : digits[i]}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          style={{
            width: 46, height: 56, textAlign: 'center', fontSize: '1.5rem', fontWeight: 800,
            border: `2px solid ${digits[i] && digits[i] !== ' ' ? '#8b5cf6' : '#e5d8ff'}`,
            borderRadius: 14, outline: 'none', color: '#2d1b69', background: 'white',
            fontFamily: 'Nunito', transition: 'border 0.2s',
          }}
        />
      ))}
    </div>
  );
}

// ── Flow ──────────────────────────────────────────────────────
// Step 0 — Enter email → click "Send OTP" button next to email field
// Step 1 — Enter OTP received on email → verify
// Step 2 — Enter full name + password
// Step 3 — Choose language
// Step 4 — Choose avatar
// Step 5 — Choose gender
// Step 6 — Choose companion type → creates account

export default function SignupFlow({ onSwitchToLogin }) {
  const { login } = useAuth();
  const [step, setStep]           = useState(0);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [otp, setOtp]             = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [form, setForm] = useState({
    email: '', fullName: '', password: '', confirmPassword: '',
    language: 'English', avatar: '🦋', gender: 'Prefer not to say', companionType: 'Buddy',
  });

  const set = f => v => setForm(p => ({ ...p, [f]: v }));

  const startResendTimer = () => {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  // ── Step 0: Send OTP to email ─────────────────────────────
  const handleSendOTP = async () => {
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      return setError('Please enter a valid email address.');
    }
    setError(''); setLoading(true);
    try {
      const { ok, data } = await authAPI.sendEmailOTP(form.email.trim().toLowerCase());
      if (!ok) { setError(data.message || 'Failed to send OTP.'); }
      else { setStep(1); startResendTimer(); }
    } catch { setError('Network error. Make sure backend is running on port 5001.'); }
    finally { setLoading(false); }
  };

  // ── Step 1: Verify OTP ────────────────────────────────────
  const handleVerifyOTP = async () => {
    if (otp.length < 6) return setError('Please enter the complete 6-digit code.');
    setError(''); setLoading(true);
    try {
      const { ok, data } = await authAPI.verifyEmailOTP(form.email.trim().toLowerCase(), otp);
      if (!ok) setError(data.message || 'Incorrect code. Please try again.');
      else setStep(2);
    } catch { setError('Network error.'); }
    finally { setLoading(false); }
  };

  // ── Resend OTP ────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(''); setOtp('');
    try {
      const { ok, data } = await authAPI.resendOTP(form.email.trim().toLowerCase());
      if (ok) startResendTimer();
      else setError(data.message);
    } catch { setError('Network error.'); }
  };

  // ── Step 2 validation ─────────────────────────────────────
  const validateStep2 = () => {
    if (!form.fullName.trim() || form.fullName.trim().length < 2) return 'Full name must be at least 2 characters.';
    if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters.';
    if (!/\d/.test(form.password)) return 'Password must contain at least one number.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  // ── Final step: Create account ────────────────────────────
  const handleCreateAccount = async () => {
    setError(''); setLoading(true);
    try {
      const { ok, data } = await authAPI.signup({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        language: form.language,
        avatar: form.avatar,
        gender: form.gender,
        companionType: form.companionType,
      });
      if (!ok) setError(data.message || 'Signup failed. Please try again.');
      else login(data.token, data.user);
    } catch { setError('Network error.'); }
    finally { setLoading(false); }
  };

  // ─────────────────────────────────────────────────────────
  // STEP 0: Email entry with inline Send OTP button
  // ─────────────────────────────────────────────────────────
  if (step === 0) return (
    <div className="page" style={{ padding: '0 24px' }}>
      <div style={{ textAlign: 'center', paddingTop: '52px', paddingBottom: '24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🦋</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.1rem', color: '#2d1b69' }}>SoulSync</h1>
        <p style={{ color: '#9c7cc0', marginTop: '6px' }}>Your emotional companion</p>
        <div className="divider" style={{ margin: '12px auto' }} />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ flex: 1 }}>
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              className="input-field"
              type="email"
              placeholder="you@gmail.com"
              value={form.email}
              onChange={e => { set('email')(e.target.value); setError(''); }}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <button
              onClick={handleSendOTP}
              disabled={loading || !form.email.trim()}
              style={{
                padding: '12px 16px',
                background: form.email.trim() ? 'linear-gradient(135deg,#8b5cf6,#a855f7)' : '#e5d8ff',
                color: form.email.trim() ? 'white' : '#c4b5fd',
                border: 'none', borderRadius: 14, fontWeight: 800,
                fontSize: '0.82rem', cursor: form.email.trim() ? 'pointer' : 'default',
                whiteSpace: 'nowrap', fontFamily: 'Nunito',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              {loading ? '...' : 'Send OTP 📧'}
            </button>
          </div>
        </div>

        <p style={{ color: '#9c7cc0', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center' }}>
          We'll send a 6-digit code to verify your email
        </p>

        <p style={{ textAlign: 'center', color: '#9c7cc0', fontSize: '0.9rem', marginTop: '24px' }}>
          Already have an account?{' '}
          <span style={{ color: '#7c3aed', fontWeight: 700, cursor: 'pointer' }} onClick={onSwitchToLogin}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // STEP 1: OTP verification
  // ─────────────────────────────────────────────────────────
  if (step === 1) return (
    <div className="page" style={{ padding: '60px 24px 40px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80,
          background: 'linear-gradient(135deg,#8b5cf6,#a855f7)',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px',
        }}>📧</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d1b69' }}>Check Your Email</h2>
        <p style={{ color: '#9c7cc0', marginTop: '10px', lineHeight: 1.6 }}>
          We sent a 6-digit code to<br />
          <strong style={{ color: '#7c3aed' }}>{form.email}</strong>
        </p>
      </div>

      {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

      <OTPInput value={otp} onChange={setOtp} />

      <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#c4b5fd', marginBottom: '24px' }}>
        Code expires in 10 minutes
      </p>

      <button className="btn-primary" onClick={handleVerifyOTP} disabled={loading || otp.length < 6}>
        {loading ? <><div className="spinner" />Verifying...</> : 'Verify Email ✅'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#9c7cc0', fontSize: '0.88rem' }}>
          Didn't receive the code?{' '}
          <span
            onClick={handleResend}
            style={{
              color: resendCooldown > 0 ? '#c4b5fd' : '#7c3aed',
              fontWeight: 700, cursor: resendCooldown > 0 ? 'default' : 'pointer',
            }}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </span>
        </p>
        <p
          style={{ color: '#c4b5fd', fontSize: '0.82rem', marginTop: '8px', cursor: 'pointer' }}
          onClick={() => { setStep(0); setOtp(''); setError(''); }}
        >
          ← Change email address
        </p>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // STEP 2: Name + Password
  // ─────────────────────────────────────────────────────────
  if (step === 2) return (
    <div className="page" style={{ padding: '50px 24px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d1b69' }}>Email Verified!</h2>
        <p style={{ color: '#9c7cc0', marginTop: '6px' }}>Now let's set up your account</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="input-group">
        <label className="input-label">Full Name</label>
        <input className="input-field" placeholder="Your name" value={form.fullName} onChange={e => set('fullName')(e.target.value)} />
      </div>
      <div className="input-group">
        <label className="input-label">Password</label>
        <input className="input-field" type="password" placeholder="Min 6 chars, include a number" value={form.password} onChange={e => set('password')(e.target.value)} />
      </div>
      <div className="input-group">
        <label className="input-label">Confirm Password</label>
        <input className="input-field" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => set('confirmPassword')(e.target.value)} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className="btn-primary" onClick={() => {
          const err = validateStep2();
          if (err) { setError(err); return; }
          setError(''); setStep(3);
        }}>
          Continue →
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // STEP 3: Language
  // ─────────────────────────────────────────────────────────
  if (step === 3) return (
    <div className="page" style={{ padding: '60px 24px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d1b69' }}>Choose Your Language</h2>
        <p style={{ color: '#9c7cc0', marginTop: '8px' }}>SoulSync will respond in your language</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {LANGS.map(l => (
          <div key={l.name} className={`card ${form.language === l.name ? 'selected' : ''}`}
            onClick={() => set('language')(l.name)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 42, height: 42, background: '#f5f0ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#6d28d9' }}>{l.code}</div>
              <div>
                <div style={{ fontWeight: 800, color: '#2d1b69' }}>{l.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#9c7cc0' }}>{l.native}</div>
              </div>
            </div>
            {form.language === l.name && <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '28px' }}>
        <button className="btn-primary" onClick={() => setStep(4)}>Continue →</button>
      </div>
      <Dots active={0} />
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // STEP 4: Avatar
  // ─────────────────────────────────────────────────────────
  if (step === 4) return (
    <div className="page" style={{ padding: '50px 24px 40px' }}>
      <div style={{ marginBottom: '24px' }}><div className="back-btn" onClick={() => setStep(3)}>←</div></div>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d1b69' }}>Pick Your Avatar</h2>
      </div>
      <div className="avatar-grid">
        {AVATARS.map((a, i) => (
          <div key={i} className={`avatar-item ${form.avatar === a.emoji ? 'selected' : ''}`}
            style={{ background: a.bg }} onClick={() => set('avatar')(a.emoji)}>{a.emoji}</div>
        ))}
      </div>
      <div style={{ marginTop: '36px', display: 'flex', gap: '12px' }}>
        <button className="btn-secondary" onClick={() => setStep(3)} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={() => setStep(5)} style={{ flex: 2 }}>Continue →</button>
      </div>
      <Dots active={1} />
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // STEP 5: Gender
  // ─────────────────────────────────────────────────────────
  if (step === 5) return (
    <div className="page" style={{ padding: '50px 24px 40px' }}>
      <div style={{ marginBottom: '24px' }}><div className="back-btn" onClick={() => setStep(4)}>←</div></div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d1b69' }}>How Do You Identify?</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {GENDERS.map((g, i) => (
          <div key={i} className={`card ${form.gender === g.label ? 'selected' : ''}`}
            onClick={() => set('gender')(g.label)} style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '10px' }}>{g.emoji}</div>
            <div style={{ fontWeight: 800, color: '#2d1b69', fontSize: '0.9rem' }}>{g.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
        <button className="btn-secondary" onClick={() => setStep(4)} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={() => setStep(6)} style={{ flex: 2 }}>Continue →</button>
      </div>
      <Dots active={2} />
    </div>
  );

  // ─────────────────────────────────────────────────────────
  // STEP 6: Companion type → final account creation
  // ─────────────────────────────────────────────────────────
  return (
    <div className="page" style={{ padding: '50px 24px 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d1b69' }}>Choose Your Companion</h2>
        <p style={{ color: '#9c7cc0', marginTop: '8px' }}>Who would you like SoulSync to be?</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {COMPANIONS.map((c, i) => (
          <div key={i} className={`card ${form.companionType === c.label ? 'selected' : ''}`}
            onClick={() => set('companionType')(c.label)}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 18px' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontWeight: 800, color: '#2d1b69', marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: '0.83rem', color: '#9c7cc0' }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button className="btn-secondary" onClick={() => setStep(5)} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={handleCreateAccount} style={{ flex: 2 }} disabled={loading}>
          {loading ? <><div className="spinner" />Creating account...</> : 'Get Started 🦋'}
        </button>
      </div>
      <Dots active={3} />
    </div>
  );
}