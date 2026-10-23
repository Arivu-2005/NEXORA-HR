import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';

export const LeavesPage = () => {
  const { user, token } = useAuth();
  const [leaves, setLeaves] = useState([
    {
      _id: 'l1',
      userName: 'Emily Davis',
      leaveType: 'Paid Vacation',
      startDate: '2026-11-10',
      endDate: '2026-11-14',
      days: 5,
      reason: 'Family annual holiday trip',
      status: 'Approved',
      reviewedBy: 'Sarah Jenkins',
      reviewComment: 'Approved. Enjoy your vacation!'
    },
    {
      _id: 'l2',
      userName: 'Noah Patel',
      leaveType: 'Sick Leave',
      startDate: '2026-10-28',
      endDate: '2026-10-29',
      days: 2,
      reason: 'Medical checkup and doctor consultation',
      status: 'Pending',
      reviewedBy: null,
      reviewComment: ''
    }
  ]);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Paid Vacation',
    startDate: '',
    endDate: '',
    days: 1,
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE}/leaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLeaves(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (token) fetchLeaves();
  }, [token]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setLeaves(prev => [data.data, ...prev]);
      } else {
        setLeaves(prev => [{ ...formData, _id: Date.now().toString(), userName: user?.name, status: 'Pending' }, ...prev]);
      }
    } catch (err) {
      setLeaves(prev => [{ ...formData, _id: Date.now().toString(), userName: user?.name, status: 'Pending' }, ...prev]);
    }
    setShowApplyModal(false);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reviewComment: `Reviewed and marked ${status}` })
      });
    } catch (err) {}
    setLeaves(prev => prev.map(l => l._id === id ? { ...l, status, reviewedBy: user?.name } : l));
  };

  const canApprove = user?.role === 'Admin' || user?.role === 'HR' || user?.role === 'Manager';

  return (
    <div className="page-container">
      {/* Leave Balances Header */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>🌴</div>
          <div className="stat-info">
            <h3>15 Days</h3>
            <p>Annual Paid Leave Balance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>🩹</div>
          <div className="stat-info">
            <h3>8 Days</h3>
            <p>Sick Leave Balance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>☕</div>
          <div className="stat-info">
            <h3>4 Days</h3>
            <p>Casual Leave Available</p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title">Leave Applications & Approvals</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Submit time off requests and manage departmental approval workflows.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
            ✈️ Request Time Off
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                {canApprove && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id}>
                  <td><strong>{l.userName}</strong></td>
                  <td>{l.leaveType}</td>
                  <td>{l.startDate} to {l.endDate}</td>
                  <td><strong>{l.days} day(s)</strong></td>
                  <td style={{ maxWidth: '220px', fontSize: '0.825rem' }}>{l.reason}</td>
                  <td>
                    <span className={`badge ${l.status === 'Approved' ? 'badge-success' : l.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                      {l.status}
                    </span>
                  </td>
                  {canApprove && (
                    <td>
                      {l.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(l._id, 'Approved')}>
                            Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(l._id, 'Rejected')}>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Reviewed by {l.reviewedBy || 'HR'}</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Submit Leave Request</h3>
              <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleApply}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Leave Category</label>
                  <select
                    className="form-control"
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  >
                    <option value="Paid Vacation">Paid Vacation</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Maternity/Paternity">Maternity/Paternity</option>
                    <option value="Unpaid">Unpaid Leave</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      required
                      className="form-control"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Total Days Requested</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="form-control"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reason / Justification</label>
                  <textarea
                    rows={3}
                    required
                    className="form-control"
                    placeholder="Provide details about your planned leave..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
