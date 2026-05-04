import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Same domain on Vercel — no env var needed
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Axios interceptor: attach token to every request
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      const t = localStorage.getItem('token');
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return config;
    });
    return () => axios.interceptors.request.eject(requestInterceptor);
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/auth/me`);
      setUser(data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token, fetchMe]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const verifyEmail = async (email, otp) => {
    const { data } = await axios.post(`${API_BASE}/auth/verify-email`, { email, otp });
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user, loading, token,
      login, register, logout, verifyEmail, forgotPassword,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isVerified: user?.isVerified,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
