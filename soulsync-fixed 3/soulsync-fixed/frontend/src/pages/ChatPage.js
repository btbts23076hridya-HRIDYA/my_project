import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { HomeIcon, TalkIcon, JournalIcon } from '../components/Icons';

export default function ChatPage({ onNav }) {
  const { user } = useAuth();
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError]             = useState('');
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Language-specific greeting
  const getGreeting = () => {
    const name = user?.fullName?.split(' ')[0] || 'there';
    const type = user?.companionType || 'Buddy';
    const greetings = {
      Hindi: `नमस्ते ${name}! मैं SoulSync हूं, तुम्हारा ${
        type === 'Best Friend' ? 'यार' :
        type === 'Mentor'      ? 'mentor' :
        type === 'Teacher'     ? 'teacher' : 'साथी'
      } 💜 आज कैसा महसूस हो रहा है? बताओ ना!`,
      Punjabi: `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${name}! ਮੈਂ SoulSync ਹਾਂ 💜 ਅੱਜ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?`,
      English: `Hey ${name}! I'm SoulSync, your ${type?.toLowerCase() || 'companion'} 💜 How are you feeling today? I'm here for you!`,
    };
    return greetings[user?.language] || greetings.English;
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { ok, data } = await chatAPI.getToday();
        if (ok && data.messages.length > 0) setMessages(data.messages);
        else setMessages([{ role: 'assistant', content: getGreeting() }]);
      } catch {
        setMessages([{ role: 'assistant', content: getGreeting() }]);
      } finally { setLoadingHistory(false); }
    };
    loadHistory();
  }, []); // eslint-disable-line

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput(''); setError('');
    setMessages(m => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { ok, data } = await chatAPI.send(text);
      if (ok) {
        setMessages(m => [...m, { role: 'assistant', content: data.aiMessage.content }]);
      } else {
        setError(data.message || 'Failed to send.');
        setMessages(m => m.slice(0, -1));
        setInput(text);
      }
    } catch {
      setError('Network error. Is backend running on port 5001?');
      setMessages(m => m.slice(0, -1));
      setInput(text);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const placeholder = {
    Hindi:   'अपने मन की बात बताओ...',
    Punjabi: 'ਆਪਣੇ ਮਨ ਦੀ ਗੱਲ ਦੱਸੋ...',
    English: 'Share your thoughts...',
  }[user?.language] || 'Share your thoughts...';

  if (loadingHistory) return (
    <div className="page" style={{ alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', color:'#9c7cc0' }}>
        <div style={{ fontSize:'2rem', marginBottom:'12px' }}>🦋</div>
        <p style={{ fontWeight:700 }}>Loading your chat...</p>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ paddingBottom:'140px' }}>

      {/* Header */}
      <div style={{ padding:'48px 24px 14px', display:'flex', alignItems:'center', gap:'12px', background:'white', borderBottom:'1px solid #f0e8ff', position:'sticky', top:0, zIndex:10 }}>
        <div className="back-btn" onClick={() => onNav('dashboard')}>←</div>
        <div style={{ width:44, height:44, background:'#f0e8ff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>🦋</div>
        <div>
          <p style={{ fontWeight:800, color:'#2d1b69' }}>SoulSync</p>
          <p style={{ fontSize:'0.8rem', color:'#10b981', fontWeight:700 }}>● Online — {user?.companionType}</p>
        </div>
        <div style={{ marginLeft:'auto', background:'#f0e8ff', borderRadius:12, padding:'6px 12px', fontSize:'0.8rem', fontWeight:700, color:'#6d28d9' }}>
          🌐 {user?.language}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, padding:'20px 20px 8px', display:'flex', flexDirection:'column', gap:'14px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start', gap:'8px', alignItems:'flex-end' }}>
            {m.role === 'assistant' && <span style={{ fontSize:'1.3rem', flexShrink:0 }}>💜</span>}
            <div className={m.role==='assistant' ? 'chat-bubble-ai' : 'chat-bubble-user'} style={{ whiteSpace:'pre-wrap' }}>
              {m.content}
            </div>
            {m.role === 'user' && <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{user?.avatar || '🦋'}</span>}
          </div>
        ))}

        {loading && (
          <div style={{ display:'flex', gap:'8px', alignItems:'flex-end' }}>
            <span style={{ fontSize:'1.3rem' }}>💜</span>
            <div className="chat-bubble-ai"><div className="typing-dots"><span/><span/><span/></div></div>
          </div>
        )}

        {error && <div className="alert alert-error" style={{ margin:0 }}>{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div style={{ position:'fixed', bottom:'68px', left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, padding:'12px 20px', background:'white', borderTop:'1px solid #f0e8ff' }}>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <input ref={inputRef} className="input-field"
            style={{ flex:1, padding:'12px 16px', borderRadius:'50px' }}
            placeholder={placeholder}
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()}
            disabled={loading} />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ width:46, height:46, borderRadius:'50%',
              background: loading||!input.trim() ? '#e5d8ff' : 'linear-gradient(135deg,#8b5cf6,#a855f7)',
              border:'none', color: loading||!input.trim() ? '#a78bfa' : 'white',
              fontSize:'1.1rem', cursor: loading||!input.trim() ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
            {loading
              ? <div className="spinner" style={{ width:16, height:16, borderColor:'rgba(139,92,246,0.3)', borderTopColor:'#8b5cf6' }} />
              : '➤'}
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => onNav('dashboard')}><HomeIcon /><span>Home</span></div>
        <div className="nav-item active"><TalkIcon active /><span>Talk</span></div>
        <div className="nav-item" onClick={() => onNav('journal')}><JournalIcon /><span>Journal</span></div>
      </div>
    </div>
  );
}
