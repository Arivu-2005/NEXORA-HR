import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';

export const PerformancePage = () => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([
    {
      _id: 'p1',
      employeeName: 'Emily Davis',
      reviewerName: 'Liam Vance',
      cycle: 'Q1 - 2026',
      goalTitle: 'UI Architecture Modernization',
      kpiMetrics: 'Deliver Vite + React refactor with zero regression and 98% test coverage',
      kpiProgress: 92,
      rating: 5,
      feedback: 'Outstanding frontend work! System load speeds improved significantly.',
      status: 'Completed'
    },
    {
      _id: 'p2',
      employeeName: 'Noah Patel',
      reviewerName: 'Alexander Wright',
      cycle: 'Q1 - 2026',
      goalTitle: 'Product User Journey Mapping',
      kpiMetrics: 'Map complete user onboarding funnel and boost retention by 15%',
      kpiProgress: 75,
      rating: 4,
      feedback: 'Great progress. Working effectively with customer success team.',
      status: 'In Progress'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    goalTitle: '',
    kpiMetrics: '',
    kpiProgress: 80,
    rating: 4,
    feedback: '',
    cycle: 'Q1 - 2026'
  });

  const fetchPerformance = async () => {
    try {
      const res = await fetch(`${API_BASE}/performance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviews(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (token) fetchPerformance();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.data, ...prev]);
      } else {
        setReviews(prev => [{ ...formData, _id: Date.now().toString(), reviewerName: user?.name, status: 'Completed' }, ...prev]);
      }
    } catch (err) {
      setReviews(prev => [{ ...formData, _id: Date.now().toString(), reviewerName: user?.name, status: 'Completed' }, ...prev]);
    }
    setShowModal(false);
  };

  const canReview = user?.role === 'Admin' || user?.role === 'HR' || user?.role === 'Manager';

  return (
    <div className="page-container">
      <div className="card-header-flex">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Performance Goals & KPI Tracking</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Drive excellence through continuous evaluations, key performance metrics, and feedback.
          </p>
        </div>
        {canReview && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            🎯 Record Performance Review
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
        {reviews.map((rev) => (
          <div key={rev._id} className="content-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-info">{rev.cycle}</span>
              <div style={{ color: '#f59e0b', fontWeight: '700' }}>
                {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)} ({rev.rating}/5)
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {rev.goalTitle}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Employee: <strong>{rev.employeeName}</strong> | Reviewer: {rev.reviewerName}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600' }}>
                <span>KPI Milestone Progress</span>
                <span style={{ color: '#2563eb' }}>{rev.kpiProgress}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${rev.kpiProgress}%` }}></div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Reviewer Feedback</div>
              <p style={{ fontSize: '0.85rem', color: '#1e293b', marginTop: '0.25rem', fontStyle: 'italic' }}>
                “{rev.feedback}”
              </p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Add Employee Performance Review</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Emily Davis"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Goal / Objective Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Q1 Infrastructure Scale & Microservices"
                    value={formData.goalTitle}
                    onChange={(e) => setFormData({ ...formData, goalTitle: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Target Review Cycle</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.cycle}
                      onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rating (1 to 5 Stars)</label>
                    <select
                      className="form-control"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    >
                      <option value={5}>5 - Exceptional</option>
                      <option value={4}>4 - Exceeds Expectations</option>
                      <option value={3}>3 - Meets Requirements</option>
                      <option value={2}>2 - Needs Improvement</option>
                      <option value={1}>1 - Unsatisfactory</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Milestone Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={formData.kpiProgress}
                    onChange={(e) => setFormData({ ...formData, kpiProgress: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Detailed Constructive Feedback</label>
                  <textarea
                    rows={3}
                    required
                    className="form-control"
                    placeholder="Write detailed observations and achievements..."
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
