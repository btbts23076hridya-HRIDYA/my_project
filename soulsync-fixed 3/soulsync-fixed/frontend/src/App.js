import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { globalStyle } from './styles';
import SignupFlow   from './pages/SignupFlow';
import LoginPage    from './pages/LoginPage';
import Dashboard    from './pages/Dashboard';
import ChatPage     from './pages/ChatPage';
import JournalPage  from './pages/JournalPage';
import ProfilePage  from './pages/ProfilePage';

function LoadingScreen() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:16 }}>
      <style>{`@keyframes flutter{0%,100%{transform:rotate(-10deg) scale(1)}50%{transform:rotate(10deg) scale(1.1)}}`}</style>
      <div style={{ fontSize:'3rem', animation:'flutter 1.2s ease-in-out infinite' }}>🦋</div>
      <p style={{ color:'#9c7cc0', fontWeight:700, fontFamily:'Nunito' }}>Loading SoulSync...</p>
    </div>
  );
}

function InnerApp() {
  const { user, loading } = useAuth();
  const [screen, setScreen]   = useState('dashboard');
  const [authMode, setAuthMode] = useState('signup');

  if (loading) return <LoadingScreen />;

  if (!user) return (
    <div className="app">
      <div className="bg-blob bg-blob-1"/><div className="bg-blob bg-blob-2"/><div className="bg-blob bg-blob-3"/>
      {authMode === 'signup'
        ? <SignupFlow  onSwitchToLogin={() => setAuthMode('login')} />
        : <LoginPage   onSwitchToSignup={() => setAuthMode('signup')} />}
    </div>
  );

  return (
    <div className="app">
      <div className="bg-blob bg-blob-1"/><div className="bg-blob bg-blob-2"/><div className="bg-blob bg-blob-3"/>
      {screen === 'dashboard' && <Dashboard   onNav={setScreen} />}
      {screen === 'chat'      && <ChatPage    onNav={setScreen} />}
      {screen === 'journal'   && <JournalPage onNav={setScreen} />}
      {screen === 'profile'   && <ProfilePage onNav={setScreen} />}
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{globalStyle}</style>
      <AuthProvider><InnerApp /></AuthProvider>
    </>
  );
}
