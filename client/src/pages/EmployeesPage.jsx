import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';

export const EmployeesPage = () => {
  const { user, token } = useAuth();
  const [employees, setEmployees] = useState([
    {
      _id: '1',
      name: 'Alexander Wright',
      email: 'admin@nexora.com',
      role: 'Admin',
      department: 'Engineering',
      designation: 'Chief Technology Officer',
      phone: '+1 (555) 901-2345',
      salary: 165000,
      status: 'Active'
    },
    {
      _id: '2',
      name: 'Sarah Jenkins',
      email: 'hr@nexora.com',
      role: 'HR',
      department: 'Human Resources',
      designation: 'Head of People Operations',
      phone: '+1 (555) 802-3456',
      salary: 110000,
      status: 'Active'
    },
    {
      _id: '3',
      name: 'Liam Vance',
      email: 'manager@nexora.com',
      role: 'Manager',
      department: 'Engineering',
      designation: 'Engineering Lead',
      phone: '+1 (555) 703-4567',
      salary: 125000,
      status: 'Active'
    },
    {
      _id: '4',
      name: 'Emily Davis',
      email: 'employee@nexora.com',
      role: 'Employee',
      department: 'Engineering',
      designation: 'Senior Frontend Engineer',
      phone: '+1 (555) 604-5678',
      salary: 92000,
      status: 'Active'
    },
    {
      _id: '5',
      name: 'Noah Patel',
      email: 'noah@nexora.com',
      role: 'Employee',
      department: 'Product Management',
      designation: 'Product Analyst',
      phone: '+1 (555) 505-6789',
      salary: 84000,
      status: 'Active'
    }
  ]);

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: 'Engineering',
    designation: '',
    phone: '',
    salary: 65000,
    status: 'Active'
  });

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEmployees(data.data);
      }
    } catch (err) {
      // Local state fallback preserved
    }
  };

  useEffect(() => {
    if (token) fetchEmployees();
  }, [token]);

  const handleOpenAdd = () => {
    setEditingEmp(null);
    setFormData({
      name: '',
      email: '',
      role: 'Employee',
      department: 'Engineering',
      designation: '',
      phone: '',
      salary: 65000,
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (emp) => {
    setEditingEmp(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      designation: emp.designation,
      phone: emp.phone,
      salary: emp.salary || 65000,
      status: emp.status || 'Active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee record?')) return;
    try {
      await fetch(`${API_BASE}/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // Offline fallback
    }
    setEmployees(prev => prev.filter(e => e._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingEmp) {
      // Update
      try {
        const res = await fetch(`${API_BASE}/employees/${editingEmp._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          setEmployees(prev => prev.map(em => em._id === editingEmp._id ? data.data : em));
        } else {
          setEmployees(prev => prev.map(em => em._id === editingEmp._id ? { ...em, ...formData } : em));
        }
      } catch (err) {
        setEmployees(prev => prev.map(em => em._id === editingEmp._id ? { ...em, ...formData } : em));
      }
    } else {
      // Create
      try {
        const res = await fetch(`${API_BASE}/employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          setEmployees(prev => [data.data, ...prev]);
        } else {
          setEmployees(prev => [{ ...formData, _id: Date.now().toString() }, ...prev]);
        }
      } catch (err) {
        setEmployees(prev => [{ ...formData, _id: Date.now().toString() }, ...prev]);
      }
    }
    setShowModal(false);
  };

  // Filter and search
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const canManage = user?.role === 'Admin' || user?.role === 'HR';

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-title">Employee Directory</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Search, filter, and maintain organizational personnel records.
            </p>
          </div>
          {canManage && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              ➕ Add New Employee
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by name, title or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ width: '200px' }}>
            <select
              className="form-control"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Product Management">Product Management</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role & Title</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Status</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 6 : 5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No employee records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="user-avatar-badge" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{emp.designation}</div>
                      <span className="badge badge-info">{emp.role}</span>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.phone}</td>
                    <td>
                      <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                        {emp.status}
                      </span>
                    </td>
                    {canManage && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(emp)}>
                            ✏️ Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp._id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                {editingEmp ? 'Edit Employee Details' : 'Add New Employee'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-control"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="HR">HR</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-control"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Product Management">Product Management</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Job Title / Designation</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmp ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
