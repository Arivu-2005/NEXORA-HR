import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const API_BASE = 'http://localhost:5000/api';

// Pre-packaged fallback demo data for immediate offline / pre-backend trial
const DEMO_USERS = {
  'admin@nexora.com': {
    id: 'usr_admin',
    name: 'Alexander Wright',
    email: 'admin@nexora.com',
    role: 'Admin',
    department: 'Engineering',
    designation: 'Chief Technology Officer',
    phone: '+1 (555) 901-2345'
  },
  'hr@nexora.com': {
    id: 'usr_hr',
    name: 'Sarah Jenkins',
    email: 'hr@nexora.com',
    role: 'HR',
    department: 'Human Resources',
    designation: 'Head of People Operations',
    phone: '+1 (555) 802-3456'
  },
  'manager@nexora.com': {
    id: 'usr_manager',
    name: 'Liam Vance',
    email: 'manager@nexora.com',
    role: 'Manager',
    department: 'Engineering',
    designation: 'Engineering Lead',
    phone: '+1 (555) 703-4567'
  },
  'employee@nexora.com': {
    id: 'usr_emp',
    name: 'Emily Davis',
    email: 'employee@nexora.com',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    phone: '+1 (555) 604-5678'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexora_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nexora_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Try Live Express Server
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('nexora_user', JSON.stringify(data.user));
        localStorage.setItem('nexora_token', data.token);
        setLoading(false);
        return { success: true };
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.warn('[NEXORA HR] Live API unreachable or returned error, falling back to instant client demo mode:', err.message);

      // 2. Client Mock Authentication for instant testing even without MongoDB running
      const matched = DEMO_USERS[email.toLowerCase().trim()];
      if (matched && password === 'password123') {
        setUser(matched);
        setToken('demo_jwt_token_12345');
        localStorage.setItem('nexora_user', JSON.stringify(matched));
        localStorage.setItem('nexora_token', 'demo_jwt_token_12345');
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, message: 'Invalid credentials. Hint: use password123' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexora_user');
    localStorage.removeItem('nexora_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
