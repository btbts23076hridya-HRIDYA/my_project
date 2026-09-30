import { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  // For unverified users redirected to OTP entry
  const [needsOTP, setNeedsOTP] = useState(false);
  const [otp, setOtp]         = useState('');
  const [devOtp, setDevOtp]   = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) return setError('Please enter your email.');
    if (!password)     return setError('Please enter your password.');
    setLoading(true);
    try {
      const { ok, data } = await authAPI.login(email.trim().toLowerCase(), password);
      if (!ok) {
        // Unverified account — show OTP input
        if (data.requiresVerification) {
          setNeedsOTP(true);
          if (data.otp) setDevOtp(data.otp); // dev mode
          setError(data.message);
        } else {
          setError(data.message || 'Login failed.');
        }
      } else {
        login(data.token, data.user);
      }
    } catch { setError('Network error. Make sure backend is running on port 5001.'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return setError('Enter the 6-digit code.');
    setLoading(true); setError('');
    try {
      const { ok, data } = await authAPI.verifyOTP(email.trim().toLowerCase(), otp);
      if (!ok) setError(data.message || 'Wrong code.');
      else login(data.token, data.user);
    } catch { setError('Network error.'); }
    finally { setLoading(false); }
  };

  // ── OTP entry (for unverified login) ─────────────────────
  if (needsOTP) return (
    <div className="page" style={{ padding:'0 24px', justifyContent:'center' }}>
      <div style={{ textAlign:'center', paddingTop:'60px', paddingBottom:'28px' }}>
        <div style={{ fontSize:'3rem', marginBottom:'10px' }}>📧</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#2d1b69' }}>Verify Your Email</h2>
        <p style={{ color:'#9c7cc0', marginTop:'8px' }}>Enter the code sent to<br/><strong style={{ color:'#7c3aed' }}>{email}</strong></p>
      </div>

      {devOtp && (
        <div style={{ padding:'14px 18px', background:'#fef3c7', border:'2px solid #f59e0b', borderRadius:14, textAlign:'center', marginBottom:16 }}>
          <p style={{ fontSize:'0.82rem', color:'#92400e', fontWeight:700, marginBottom:6 }}>📋 Your OTP (email not configured)</p>
          <p style={{ fontSize:'2rem', fontWeight:800, letterSpacing:'8px', color:'#92400e', fontFamily:'monospace' }}>{devOtp}</p>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="input-group">
        <label className="input-label">6-Digit Code</label>
        <input className="input-field" type="text" inputMode="numeric" placeholder="123456"
          maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
          onKeyDown={e => e.key === 'Enter' && handleVerify()}
          style={{ textAlign:'center', fontSize:'1.4rem', letterSpacing:'6px', fontWeight:800 }} />
      </div>

      <button className="btn-primary" onClick={handleVerify} disabled={loading || otp.length < 6}>
        {loading ? <><div className="spinner"/>Verifying...</> : 'Verify & Login 🦋'}
      </button>
      <p style={{ textAlign:'center', marginTop:14, color:'#9c7cc0', fontSize:'0.88rem', cursor:'pointer' }}
        onClick={() => { setNeedsOTP(false); setOtp(''); setError(''); }}>← Back to login</p>
    </div>
  );

  // ── Normal login ──────────────────────────────────────────
  return (
    <div className="page" style={{ padding:'0 24px', justifyContent:'center' }}>
      <div style={{ textAlign:'center', paddingTop:'72px', paddingBottom:'36px' }}>
        <div style={{ fontSize:'3.2rem', marginBottom:'10px' }}>🦋</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', color:'#2d1b69' }}>Welcome Back</h1>
        <p style={{ color:'#9c7cc0', marginTop:'6px' }}>Sign in to continue your journey</p>
        <div className="divider" style={{ margin:'14px auto' }} />
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div style={{ flex:1 }}>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input-field" type="email" placeholder="you@email.com"
            value={email} onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input-field" type="password" placeholder="••••••••"
            value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleLogin()} />
        </div>
        <div style={{ marginTop:'24px', display:'flex', flexDirection:'column', gap:'12px' }}>
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? <><div className="spinner"/>Signing in...</> : 'Sign In 💜'}
          </button>
          <p style={{ textAlign:'center', color:'#9c7cc0', fontSize:'0.9rem' }}>
            No account?{' '}
            <span style={{ color:'#7c3aed', fontWeight:700, cursor:'pointer' }} onClick={onSwitchToSignup}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
