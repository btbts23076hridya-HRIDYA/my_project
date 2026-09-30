import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { HomeIcon, TalkIcon, JournalIcon } from '../components/Icons';

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

const AVATARS = [
  { emoji: '🌸', bg: '#ffd6e7' }, { emoji: '🌿', bg: '#d6f5e0' },
  { emoji: '🌊', bg: '#d6eeff' }, { emoji: '🌙', bg: '#e8d6ff' },
  { emoji: '☀️', bg: '#fff3d6' }, { emoji: '🦋', bg: '#e8d6ff' },
  { emoji: '🌺', bg: '#ffd6e7' }, { emoji: '⭐', bg: '#fff3d6' },
];

const COMPANIONS = [
  { icon: '🧭', label: 'Mentor',      bg: '#f0e8ff' },
  { icon: '💜', label: 'Best Friend', bg: '#ffd6e7' },
  { icon: '🤝', label: 'Buddy',       bg: '#fff3d6' },
  { icon: '📚', label: 'Teacher',     bg: '#d6f5e0' },
];

const Section = ({ title, children }) => (
  <div style={{ background: 'white', borderRadius: 20, padding: '20px', border: '2px solid #f0e8ff', marginBottom: 16 }}>
    <p style={{ fontWeight: 800, color: '#6d28d9', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>{title}</p>
    {children}
  </div>
);

export default function ProfilePage({ onNav }) {
  const { user, updateUser, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    fullName:      user?.fullName      || '',
    language:      user?.language      || 'English',
    gender:        user?.gender        || 'Prefer not to say',
    companionType: user?.companionType || 'Buddy',
    avatar:        user?.avatar        || '🦋',
  });

  const set = f => v => setForm(p => ({ ...p, [f]: v }));

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const { ok, data } = await authAPI.updateProfile(form);
      if (ok) {
        updateUser(data.user);
        setSuccess('Profile updated successfully! 💜');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Update failed.');
      }
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    setForm({
      fullName:      user?.fullName      || '',
      language:      user?.language      || 'English',
      gender:        user?.gender        || 'Prefer not to say',
      companionType: user?.companionType || 'Buddy',
      avatar:        user?.avatar        || '🦋',
    });
    setError('');
    setEditing(false);
  };

  return (
    <div className="page" style={{ paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ padding: '48px 24px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="back-btn" onClick={() => onNav('dashboard')}>←</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2d1b69' }}>My Profile</h2>
        {!editing && (
          <button onClick={() => setEditing(true)}
            style={{ marginLeft: 'auto', background: '#f0e8ff', border: 'none', borderRadius: 12, padding: '8px 16px', color: '#7c3aed', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Nunito' }}>
            ✏️ Edit
          </button>
        )}
      </div>

      <div style={{ padding: '0 24px' }}>

        {success && <div className="alert alert-success">{success}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        {/* Avatar + Name card */}
        <div style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', borderRadius: 24, padding: '28px 24px', marginBottom: 16, textAlign: 'center' }}>
          {editing ? (
            <>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Choose Avatar</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                {AVATARS.map((a, i) => (
                  <div key={i} onClick={() => set('avatar')(a.emoji)}
                    style={{ aspect: '1', borderRadius: 14, background: form.avatar === a.emoji ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', cursor: 'pointer', border: `2px solid ${form.avatar === a.emoji ? 'white' : 'transparent'}`, padding: 8, transition: 'all 0.15s' }}>
                    {a.emoji}
                  </div>
                ))}
              </div>
              <input
                style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 12, padding: '10px 16px', color: 'white', fontSize: '1rem', fontFamily: 'Nunito', fontWeight: 700, width: '100%', outline: 'none', textAlign: 'center' }}
                placeholder="Your name"
                value={form.fullName}
                onChange={e => set('fullName')(e.target.value)}
              />
            </>
          ) : (
            <>
              <div style={{ fontSize: '3.5rem', marginBottom: 10 }}>{user?.avatar}</div>
              <p style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{user?.fullName}</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginTop: 6 }}>
                {user?.companionType} · {user?.language}
              </p>
              <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px' }}>
                <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700 }}>
                  {user?.isVerified ? '✅ Verified' : '⚠️ Not Verified'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Account Info */}
        <Section title="Account Info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f0ff' }}>
            <span style={{ color: '#9c7cc0', fontSize: '0.9rem' }}>Email</span>
            <span style={{ color: '#2d1b69', fontWeight: 700, fontSize: '0.9rem' }}>{user?.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f0ff' }}>
            <span style={{ color: '#9c7cc0', fontSize: '0.9rem' }}>Member since</span>
            <span style={{ color: '#2d1b69', fontWeight: 700, fontSize: '0.9rem' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ color: '#9c7cc0', fontSize: '0.9rem' }}>Streak</span>
            <span style={{ color: '#2d1b69', fontWeight: 700, fontSize: '0.9rem' }}>🔥 {user?.streak || 0} days</span>
          </div>
        </Section>

        {/* Language */}
        <Section title="Language">
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LANGS.map(l => (
                <div key={l.name} onClick={() => set('language')(l.name)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 14, background: form.language === l.name ? '#f0e8ff' : '#faf8ff', border: `2px solid ${form.language === l.name ? '#8b5cf6' : '#f0e8ff'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: '#f0e8ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#6d28d9' }}>{l.code}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#2d1b69', fontSize: '0.95rem' }}>{l.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9c7cc0' }}>{l.native}</div>
                    </div>
                  </div>
                  {form.language === l.name && <span style={{ color: '#8b5cf6', fontWeight: 800 }}>✓</span>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, background: '#f0e8ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌐</div>
              <div>
                <p style={{ fontWeight: 800, color: '#2d1b69' }}>{user?.language}</p>
                <p style={{ fontSize: '0.82rem', color: '#9c7cc0' }}>{LANGS.find(l => l.name === user?.language)?.native}</p>
              </div>
            </div>
          )}
        </Section>

        {/* Gender */}
        <Section title="Gender Identity">
          {editing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {GENDERS.map((g, i) => (
                <div key={i} onClick={() => set('gender')(g.label)}
                  style={{ textAlign: 'center', padding: '16px 10px', borderRadius: 14, background: form.gender === g.label ? '#f0e8ff' : '#faf8ff', border: `2px solid ${form.gender === g.label ? '#8b5cf6' : '#f0e8ff'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{g.emoji}</div>
                  <div style={{ fontWeight: 700, color: '#2d1b69', fontSize: '0.82rem' }}>{g.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: '2rem' }}>{GENDERS.find(g => g.label === user?.gender)?.emoji || '🤍'}</div>
              <p style={{ fontWeight: 800, color: '#2d1b69' }}>{user?.gender}</p>
            </div>
          )}
        </Section>

        {/* Companion */}
        <Section title="My Companion">
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COMPANIONS.map((c, i) => (
                <div key={i} onClick={() => set('companionType')(c.label)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: form.companionType === c.label ? '#f0e8ff' : '#faf8ff', border: `2px solid ${form.companionType === c.label ? '#8b5cf6' : '#f0e8ff'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{c.icon}</div>
                  <span style={{ fontWeight: 800, color: '#2d1b69' }}>{c.label}</span>
                  {form.companionType === c.label && <span style={{ marginLeft: 'auto', color: '#8b5cf6', fontWeight: 800 }}>✓</span>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: COMPANIONS.find(c => c.label === user?.companionType)?.bg || '#f0e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                {COMPANIONS.find(c => c.label === user?.companionType)?.icon || '🤝'}
              </div>
              <p style={{ fontWeight: 800, color: '#2d1b69' }}>{user?.companionType}</p>
            </div>
          )}
        </Section>

        {/* Save / Cancel buttons */}
        {editing && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button className="btn-secondary" onClick={handleCancel} style={{ flex: 1 }}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
              {saving ? <><div className="spinner" />Saving...</> : 'Save Changes 💜'}
            </button>
          </div>
        )}

        {/* Sign out */}
        {!editing && (
          <button onClick={logout}
            style={{ width: '100%', background: '#fee2e2', border: 'none', borderRadius: 16, padding: '14px', color: '#dc2626', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Nunito', marginBottom: 24 }}>
            Sign Out
          </button>
        )}

      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => onNav('dashboard')}><HomeIcon /><span>Home</span></div>
        <div className="nav-item" onClick={() => onNav('chat')}><TalkIcon /><span>Talk</span></div>
        <div className="nav-item" onClick={() => onNav('journal')}><JournalIcon /><span>Journal</span></div>
      </div>

    </div>
  );
}
