import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('soulsync_token');
      if (!token) { setLoading(false); return; }
      try {
        const { ok, data } = await authAPI.getMe();
        if (ok) setUser(data.user);
        else { localStorage.removeItem('soulsync_token'); }
      } catch { localStorage.removeItem('soulsync_token'); }
      finally { setLoading(false); }
    };
    check();
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('soulsync_token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('soulsync_token');
    setUser(null);
  }, []);

  // FIX: Replace entire user object when profile updated, not just merge fields
  const updateUser = useCallback((newUserData) => {
    setUser(newUserData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
