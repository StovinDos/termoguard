import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// ── Demo user used when backend is offline (laptop not running) ────────────
const DEMO_USER = { id: 1, firstName: 'Demo', lastName: 'User', email: 'demo@termoguard.io', role: 'CUSTOMER' };
const DEMO_TOKEN = 'demo-mode-token';

function isDemoToken(token) {
  return token === DEMO_TOKEN;
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tg_token');
    if (!token) { setLoading(false); return; }

    if (isDemoToken(token)) {
      // Restore demo session
      setUser(DEMO_USER);
      setDemoMode(true);
      setLoading(false);
      return;
    }

    // Real token — try to verify with backend
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      setDemoMode(false);
    } catch (err) {
      if (err.message === 'BACKEND_OFFLINE') {
        // Backend down — fallback to demo mode silently
        activateDemoMode();
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const activateDemoMode = useCallback((name = 'Demo') => {
    const demoUser = { ...DEMO_USER, firstName: name };
    localStorage.setItem('tg_token', DEMO_TOKEN);
    setUser(demoUser);
    setDemoMode(true);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { token, user: userData } = data;
      localStorage.setItem('tg_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      setDemoMode(false);
      toast.success(`Welcome back, ${userData.firstName}`);
      return userData;
    } catch (err) {
      if (err.message === 'BACKEND_OFFLINE') {
        // Backend is offline — use demo mode for presentation
        const name = email.split('@')[0];
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        activateDemoMode(capitalized);
        toast.success(`Welcome, ${capitalized} — running in demo mode`);
        return DEMO_USER;
      }
      throw err;
    }
  }, [activateDemoMode]);

  const register = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      const { token, user: userData } = data;
      localStorage.setItem('tg_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      setDemoMode(false);
      toast.success(`Account created. Welcome, ${userData.firstName}`);
      return userData;
    } catch (err) {
      if (err.message === 'BACKEND_OFFLINE') {
        activateDemoMode(payload.firstName);
        toast.success(`Welcome, ${payload.firstName} — running in demo mode`);
        return DEMO_USER;
      }
      throw err;
    }
  }, [activateDemoMode]);

  const logout = useCallback(() => {
    localStorage.removeItem('tg_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setDemoMode(false);
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      isAuthenticated: !!user,
      demoMode,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
