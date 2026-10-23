import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || 'Alexander Wright',
    email: user?.email || 'admin@nexora.com',
    role: user?.role || 'Admin',
    department: user?.department || 'Engineering',
    designation: user?.designation || 'Chief Technology Officer',
    phone: user?.phone || '+1 (555) 901-2345',
    notifications: true,
    theme: 'Clean Modern Light',
    language: 'English (US)'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="content-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="card-title" style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>
          User Profile & Workspace Settings
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Manage your personal account credentials, system notifications, and contact preferences.
        </p>

        {saved && (
          <div style={{ padding: '0.75rem', background: '#ecfdf5', color: '#065f46', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: '600' }}>
            ✅ Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                disabled
                className="form-control"
                value={profile.email}
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">System Role</label>
              <input
                type="text"
                disabled
                className="form-control"
                value={profile.role}
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Department</label>
              <input
                type="text"
                disabled
                className="form-control"
                value={profile.department}
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Title / Designation</label>
              <input
                type="text"
                className="form-control"
                value={profile.designation}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />

          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>
            Platform Preferences
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Language</label>
              <select className="form-control" value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value })}>
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Interface Theme</label>
              <select className="form-control" value={profile.theme} onChange={(e) => setProfile({ ...profile, theme: e.target.value })}>
                <option value="Clean Modern Light">Clean Modern Light (Default)</option>
                <option value="Dark Slate">Dark Slate</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              💾 Save Profile Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
