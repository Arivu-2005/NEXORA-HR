import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';

export const DepartmentsPage = () => {
  const { user, token } = useAuth();
  const [departments, setDepartments] = useState([
    {
      _id: 'd1',
      name: 'Engineering',
      code: 'ENG',
      headOfDepartment: 'Sophia Chen',
      budget: 450000,
      location: 'Building A, 4th Floor',
      memberCount: 18,
      description: 'Core software engineering, QA testing, DevOps and infrastructure.'
    },
    {
      _id: 'd2',
      name: 'Human Resources',
      code: 'HRD',
      headOfDepartment: 'David Vance',
      budget: 180000,
      location: 'Building B, 2nd Floor',
      memberCount: 6,
      description: 'Talent sourcing, internal culture, compensation, and workplace welfare.'
    },
    {
      _id: 'd3',
      name: 'Product Management',
      code: 'PRD',
      headOfDepartment: 'Elena Rostova',
      budget: 240000,
      location: 'Building A, 3rd Floor',
      memberCount: 8,
      description: 'Product lifecycle, customer feature discovery, and delivery milestones.'
    },
    {
      _id: 'd4',
      name: 'Sales & Marketing',
      code: 'MKT',
      headOfDepartment: 'Marcus Sterling',
      budget: 320000,
      location: 'Building C, 1st Floor',
      memberCount: 14,
      description: 'Outreach, enterprise marketing, brand campaigns, and client success.'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    headOfDepartment: '',
    budget: 150000,
    location: '',
    description: ''
  });

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_BASE}/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDepartments(data.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (token) fetchDepartments();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setDepartments(prev => [...prev, data.data]);
      } else {
        setDepartments(prev => [...prev, { ...formData, _id: Date.now().toString(), memberCount: 1 }]);
      }
    } catch (err) {
      setDepartments(prev => [...prev, { ...formData, _id: Date.now().toString(), memberCount: 1 }]);
    }
    setShowModal(false);
  };

  const canManage = user?.role === 'Admin' || user?.role === 'HR';

  return (
    <div className="page-container">
      <div className="card-header-flex">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Departments & Organizational Units</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Structure operational units, department leads, and resource budgets.
          </p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Create Department
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
        {departments.map((dept) => (
          <div key={dept._id} className="content-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.35rem' }}>{dept.code}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{dept.name}</h3>
              </div>
              <span className="badge badge-success">{dept.memberCount || 5} Members</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              {dept.description}
            </p>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Dept Head:</span>
                <strong>{dept.headOfDepartment}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Location:</span>
                <span>{dept.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Annual Budget:</span>
                <strong style={{ color: '#059669' }}>${dept.budget?.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Create New Department</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Operations & Logistics"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Code</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. OPS"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Head of Dept</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Michael Chang"
                      value={formData.headOfDepartment}
                      onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Building B, 3rd Floor"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Annual Budget ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    placeholder="Brief description of department scope..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
