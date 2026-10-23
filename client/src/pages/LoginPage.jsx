import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@nexora.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message || 'Login failed');
    }
  };

  const handleDemoFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div className="brand-icon" style={{ width: '42px', height: '42px', fontSize: '1.4rem' }}>N</div>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a' }}>
              NEXORA <span style={{ color: '#06b6d4' }}>HR</span>
            </span>
          </div>
          <p className="auth-tagline">“Empower People. Elevate Performance.”</p>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
            Enterprise Human Capital & Performance Suite
          </p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            background: '#fef2f2',
            color: '#ef4444',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Work Email</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
            style={{ padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div className="quick-demo-pill">
          <p style={{ fontWeight: '700', marginBottom: '0.4rem', color: '#0f172a' }}>Quick Role Switcher (Password: <code>password123</code>):</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('admin@nexora.com')}>Admin</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('hr@nexora.com')}>HR</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('manager@nexora.com')}>Manager</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleDemoFill('employee@nexora.com')}>Employee</button>
          </div>
        </div>
      </div>
    </div>
  );
};
