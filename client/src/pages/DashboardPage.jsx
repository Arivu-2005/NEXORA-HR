import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';

export const DashboardPage = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 48,
    activeEmployees: 46,
    totalDepartments: 6,
    presentToday: 42,
    pendingLeaves: 3,
    approvedLeaves: 12,
    attendanceRate: 95,
    averagePerformance: 4.4
  });

  useEffect(() => {
    // Attempt fetch from backend if connected
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        // Fallback gracefully to default stats
      }
    };
    if (token) fetchStats();
  }, [token]);

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '1.75rem',
        color: '#fff',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Welcome back, {user?.name} 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Logged in as <strong style={{ color: '#38bdf8' }}>{user?.role}</strong> — NEXORA Human Resource Information System
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('attendance')}>
            ⏱️ Clock In / Out
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('leaves')}>
            🌴 Request Leave
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>👥</div>
          <div className="stat-info">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Workforce</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>🏢</div>
          <div className="stat-info">
            <h3>{stats.totalDepartments}</h3>
            <p>Active Departments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>⏱️</div>
          <div className="stat-info">
            <h3>{stats.presentToday}</h3>
            <p>Present Today ({stats.attendanceRate}%)</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>⭐</div>
          <div className="stat-info">
            <h3>{stats.averagePerformance} / 5.0</h3>
            <p>Org Performance Avg</p>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Role Specific Actions */}
        <div className="content-card">
          <div className="card-header-flex">
            <h3 className="card-title">Quick Actions for {user?.role}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {user?.role === 'Admin' || user?.role === 'HR' ? (
              <>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate('employees')}>
                  ➕ Add New Employee Record
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate('departments')}>
                  🏢 Manage Departments & Structure
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate('leaves')}>
                  📋 Review Leave Requests ({stats.pendingLeaves} Pending)
                </button>
              </>
            ) : user?.role === 'Manager' ? (
              <>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate('performance')}>
                  🎯 Conduct Team Performance Reviews
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate('attendance')}>
                  📊 Monitor Team Daily Attendance
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate('attendance')}>
                  ⏱️ View My Shift Clock Logs
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => onNavigate('performance')}>
                  📈 Check My Assigned Q1 Goals
                </button>
              </>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="content-card">
          <div className="card-header-flex">
            <h3 className="card-title">Attendance & Shift Punctuality</h3>
            <span className="badge badge-success">Live Track</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
            Workforce on-premise & remote compliance for current cycle.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
              <span>Present On-Time</span>
              <span>88%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '88%' }}></div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
              <span>Late Arrivals</span>
              <span>7%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '7%', background: '#f59e0b' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
