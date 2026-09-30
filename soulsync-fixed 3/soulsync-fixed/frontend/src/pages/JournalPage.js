import { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import { HomeIcon, TalkIcon, JournalIcon } from '../components/Icons';

const MOODS = [
  { emoji: '🌟', label: 'Great', bg: '#fff3d6' }, { emoji: '😊', label: 'Good', bg: '#d6f5e0' },
  { emoji: '😐', label: 'Okay', bg: '#d6eeff' }, { emoji: '😔', label: 'Low', bg: '#f0e8ff' },
  { emoji: '💜', label: 'Loved', bg: '#ffd6e7' },
];

const fmt = d => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

function WriteModal({ entry, onClose, onSave }) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || '');
  const [moodEmoji, setMoodEmoji] = useState(entry?.moodEmoji || '');
  const [gratitude, setGratitude] = useState(entry?.gratitude || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return setError('Please write something.');
    setSaving(true); setError('');
    try {
      const result = entry?._id
        ? await journalAPI.update(entry._id, { title, content, mood, moodEmoji, gratitude })
        : await journalAPI.create({ title, content, mood, moodEmoji, gratitude });
      if (result.ok) onSave(result.data.entry);
      else setError(result.data.message || 'Failed to save.');
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2d1b69' }}>{entry?._id ? 'Edit Entry' : '✍️ New Entry'}</h2>
          <span style={{ cursor: 'pointer', fontSize: '1.4rem', color: '#c4b5fd' }} onClick={onClose}>✕</span>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="input-group">
          <label className="input-label">Title (optional)</label>
          <input className="input-field" placeholder="Give this entry a title..." value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Mood</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {MOODS.map(m => (
              <div key={m.label} onClick={() => { setMood(m.label); setMoodEmoji(m.emoji); }}
                style={{ padding: '7px 12px', borderRadius: 12, background: mood === m.label ? '#f0e8ff' : m.bg, border: `2px solid ${mood === m.label ? '#8b5cf6' : 'transparent'}`, cursor: 'pointer', fontSize: '0.95rem', fontWeight: 700, color: '#2d1b69', transition: 'all 0.15s' }}>
                {m.emoji} {m.label}
              </div>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Journal Entry *</label>
          <textarea className="input-field" style={{ minHeight: '140px', resize: 'vertical', lineHeight: 1.6 }}
            placeholder="What's on your mind? Write freely..." value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Gratitude (optional)</label>
          <input className="input-field" placeholder="One thing you're grateful for today..." value={gratitude} onChange={e => setGratitude(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <><div className="spinner" />Saving...</> : entry?._id ? 'Update Entry' : 'Save Entry 📔'}
        </button>
      </div>
    </div>
  );
}

export default function JournalPage({ onNav }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWrite, setShowWrite] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { loadEntries(); }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const { ok, data } = await journalAPI.getAll();
      if (ok) setEntries(data.entries);
    } finally { setLoading(false); }
  };

  const handleSave = (entry) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e._id === entry._id);
      if (idx !== -1) { const u = [...prev]; u[idx] = entry; return u; }
      return [entry, ...prev];
    });
    setShowWrite(false); setEditEntry(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    setDeletingId(id);
    try { const { ok } = await journalAPI.delete(id); if (ok) setEntries(p => p.filter(e => e._id !== id)); }
    finally { setDeletingId(null); }
  };

  const getMoodBg = mood => MOODS.find(m => m.label === mood)?.bg || '#f5f0ff';
  const getMoodEmoji = entry => entry.moodEmoji || MOODS.find(m => m.label === entry.mood)?.emoji || '📔';

  return (
    <div className="page" style={{ paddingBottom: '90px' }}>
      <div style={{ padding: '48px 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="back-btn" onClick={() => onNav('dashboard')}>←</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2d1b69' }}>My Journal</h2>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px', fontSize: '0.9rem' }}
          onClick={() => { setEditEntry(null); setShowWrite(true); }}>+ Write</button>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9c7cc0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📔</div>
            <p style={{ fontWeight: 700 }}>Loading...</p>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: 'white', borderRadius: 20, border: '2px dashed #e5d8ff' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📔</div>
            <p style={{ fontWeight: 800, color: '#2d1b69', marginBottom: '8px' }}>No entries yet</p>
            <p style={{ color: '#9c7cc0', fontSize: '0.9rem' }}>Start writing to capture your thoughts.</p>
            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setShowWrite(true)}>Write First Entry ✍️</button>
          </div>
        ) : entries.map(entry => (
          <div key={entry._id} style={{ background: 'white', borderRadius: 20, padding: '18px 20px', border: '2px solid #f0e8ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
                <div style={{ width: 44, height: 44, background: getMoodBg(entry.mood), borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{getMoodEmoji(entry)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, color: '#2d1b69', fontSize: '0.95rem' }}>{fmt(entry.createdAt)}</p>
                  {entry.title && <p style={{ fontSize: '0.88rem', color: '#6d28d9', fontWeight: 700, marginTop: 2 }}>{entry.title}</p>}
                  <p style={{ fontSize: '0.84rem', color: '#9c7cc0', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{entry.content}</p>
                  {entry.gratitude && <div style={{ marginTop: '6px' }}><span className="tag">✨ {entry.gratitude}</span></div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                <button onClick={() => { setEditEntry(entry); setShowWrite(true); }}
                  style={{ background: '#f5f0ff', border: 'none', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Nunito', color: '#6d28d9', fontWeight: 700 }}>Edit</button>
                <button onClick={() => handleDelete(entry._id)}
                  style={{ background: '#fee2e2', border: 'none', borderRadius: 10, padding: '6px 10px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Nunito', color: '#dc2626', fontWeight: 700 }}
                  disabled={deletingId === entry._id}>{deletingId === entry._id ? '...' : '🗑'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showWrite && <WriteModal entry={editEntry} onClose={() => { setShowWrite(false); setEditEntry(null); }} onSave={handleSave} />}

      <div className="bottom-nav">
        <div className="nav-item" onClick={() => onNav('dashboard')}><HomeIcon /><span>Home</span></div>
        <div className="nav-item" onClick={() => onNav('chat')}><TalkIcon /><span>Talk</span></div>
        <div className="nav-item active"><JournalIcon active /><span>Journal</span></div>
      </div>
    </div>
  );
}
