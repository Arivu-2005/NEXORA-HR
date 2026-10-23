import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'employees', label: 'Employee Directory', icon: '👥', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'departments', label: 'Departments', icon: '🏢', roles: ['Admin', 'HR', 'Manager'] },
    { id: 'attendance', label: 'Attendance', icon: '⏱️', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'leaves', label: 'Leave & Time Off', icon: '🌴', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'performance', label: 'Performance & KPIs', icon: '🎯', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'reports', label: 'Reports & Export', icon: '📑', roles: ['Admin', 'HR', 'Manager'] },
    { id: 'settings', label: 'Settings & Profile', icon: '⚙️', roles: ['Admin', 'HR', 'Manager', 'Employee'] }
  ];

  const visibleNav = navItems.filter(item => item.roles.includes(user?.role || 'Employee'));

  const handleSelect = (id) => {
    setActiveTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)}></div>
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="brand-icon">N</div>
            <div className="brand-name">
              NEXORA<span> HR</span>
            </div>
          </div>
          <button 
            className="mobile-toggle-btn"
            style={{ color: '#fff', border: 'none', fontSize: '1.2rem' }}
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        </div>

        <ul className="nav-list">
          {visibleNav.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleSelect(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar-badge">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="user-info-sidebar">
              <div className="user-name-sidebar">{user?.name}</div>
              <span className="user-role-badge">{user?.role}</span>
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm btn-block"
            onClick={logout}
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none' }}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export const Header = ({ onToggleMobile, activeTab }) => {
  const { user } = useAuth();

  const titleMap = {
    dashboard: 'System Overview & Analytics',
    employees: 'Employee Directory & Roster',
    departments: 'Organizational Departments',
    attendance: 'Workplace Attendance Tracking',
    leaves: 'Time Off & Leave Management',
    performance: 'Goals, KPIs & Reviews',
    reports: 'Compliance & Export Reports',
    settings: 'Account & Workspace Preferences'
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-toggle-btn" onClick={onToggleMobile} aria-label="Toggle navigation">
          ☰
        </button>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
            {titleMap[activeTab] || 'NEXORA HR'}
          </h2>
          <span className="header-tagline">“Empower People. Elevate Performance.”</span>
        </div>
      </div>

      <div className="header-right">
        <span className="badge badge-info">{user?.role} Portal</span>
      </div>
    </header>
  );
};
