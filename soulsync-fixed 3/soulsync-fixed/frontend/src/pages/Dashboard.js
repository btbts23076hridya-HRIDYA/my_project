import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { moodAPI } from '../services/api';
import { HomeIcon, TalkIcon, JournalIcon } from '../components/Icons';

const MOODS = [
  { emoji: '🌟', label: 'Great',  bg: '#fff3d6' },
  { emoji: '😊', label: 'Good',   bg: '#d6f5e0' },
  { emoji: '😐', label: 'Okay',   bg: '#d6eeff' },
  { emoji: '😔', label: 'Low',    bg: '#f0e8ff' },
  { emoji: '💜', label: 'Loved',  bg: '#ffd6e7' },
];

const AFFIRMATIONS = [
  "You are capable of achieving great things. Every step brings you closer to your dreams!",
  "Your feelings are valid. You are strong enough to face today with grace and courage. 💜",
  "Every day you grow, even when it doesn't feel like it. You are enough, exactly as you are.",
  "You are worthy of love, kindness, and all the beautiful things life has to offer. 🌸",
  "Take it one moment at a time. You've made it through every hard day so far. 🦋",
  "Be proud of yourself for how far you've come. Your journey matters. 🦋",
];

export default function Dashboard({ onNav }) {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodSaved,    setMoodSaved]    = useState(false);
  const [savingMood,   setSavingMood]   = useState(false);
  const [affirmation]  = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);

  useEffect(() => {
    const load = async () => {
      try {
        const { ok, data } = await moodAPI.getToday();
        if (ok && data.mood) {
          const idx = MOODS.findIndex(m => m.label === data.mood.mood);
          if (idx !== -1) { setSelectedMood(idx); setMoodSaved(true); }
        }
      } catch { /* silent */ }
    };
    load();
  }, []);

  const handleMoodSelect = async (idx) => {
    if (savingMood) return;
    setSelectedMood(idx); setSavingMood(true);
    try { await moodAPI.add(MOODS[idx].label, MOODS[idx].emoji); setMoodSaved(true); }
    catch { /* silent */ }
    setSavingMood(false);
  };

  return (
    <div className="page" style={{ paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ padding: '48px 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#9c7cc0', fontSize: '0.9rem', fontWeight: 600 }}>Welcome back,</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.5rem' }}>{user?.avatar || '🦋'}</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2d1b69' }}>{user?.fullName?.split(' ')[0]}</span>
          </div>
        </div>
        {/* Profile button */}
        <div onClick={() => onNav('profile')}
          style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.4)' }}>
          {user?.avatar || '🦋'}
        </div>
      </div>

      {/* Mood row */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontWeight: 800, color: '#2d1b69' }}>How are you feeling today?</p>
          {moodSaved && <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>✓ Saved</span>}
        </div>
        <div className="mood-row">
          {MOODS.map((m, i) => (
            <div key={i} className={`mood-item ${selectedMood === i ? 'selected' : ''}`}
              style={{ background: m.bg, opacity: savingMood ? 0.7 : 1 }}
              onClick={() => handleMoodSelect(i)}>
              <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Affirmation */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 20, border: '2px solid #f0e8ff' }}>
          <p style={{ fontWeight: 800, color: '#2d1b69', marginBottom: 12 }}>✨ Daily Affirmation</p>
          <p className="affirmation">"{affirmation}"</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12 }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 18, border: '2px solid #f0e8ff', flex: 1 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, background: '#f5f0ff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🔥</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2d1b69' }}>{user?.streak || 0}</div>
              <div style={{ fontSize: '0.8rem', color: '#9c7cc0', fontWeight: 600 }}>Day Streak</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: 20, padding: 18, border: '2px solid #f0e8ff', flex: 1, cursor: 'pointer' }} onClick={() => onNav('profile')}>
          <p style={{ fontWeight: 800, color: '#2d1b69', fontSize: '0.9rem', marginBottom: 4 }}>My Profile</p>
          <p style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '0.88rem' }}>{user?.companionType}</p>
          <p style={{ color: '#9c7cc0', fontSize: '0.78rem', marginTop: 2 }}>🌐 {user?.language}</p>
        </div>
      </div>

      {/* Talk button */}
      <div style={{ padding: '0 24px' }}>
        <button className="btn-primary" onClick={() => onNav('chat')} style={{ borderRadius: 20 }}>
          💜 Talk to SoulSync
        </button>
      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        <div className="nav-item active"><HomeIcon active /><span>Home</span></div>
        <div className="nav-item" onClick={() => onNav('chat')}><TalkIcon /><span>Talk</span></div>
        <div className="nav-item" onClick={() => onNav('journal')}><JournalIcon /><span>Journal</span></div>
      </div>
    </div>
  );
}
