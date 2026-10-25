/**
 * NEXORA HR — Master Controller & Window Event Binder
 * Coordinates state, views, API requests, modals, and exports
 */

import { state, apiRequest, loginUser, logoutUser, showToast } from './api.js';
import { renderLandingPage, renderLoginPage, renderAppShell } from './views.js';
import {
  renderDashboardModule,
  renderEmployeesModule,
  renderDepartmentsModule,
  renderAttendanceModule,
  renderLeavesModule,
  renderPerformanceModule,
  renderReportsModule,
  renderSettingsModule
} from './modules.js';

// View Controller
export function renderCurrentView() {
  const root = document.getElementById('appRoot');
  if (!root) return;

  if (state.activeView === 'landing') {
    root.innerHTML = renderLandingPage();
    window.scrollTo(0, 0);
    return;
  }

  if (state.activeView === 'login') {
    root.innerHTML = renderLoginPage();
    window.scrollTo(0, 0);
    return;
  }

  // If user not authenticated, direct to login
  if (!state.user) {
    state.activeView = 'login';
    root.innerHTML = renderLoginPage();
    return;
  }

  let moduleHtml = '';
  switch (state.activeView) {
    case 'dashboard':
      moduleHtml = renderDashboardModule();
      break;
    case 'employees':
      moduleHtml = renderEmployeesModule();
      break;
    case 'departments':
      moduleHtml = renderDepartmentsModule();
      break;
    case 'attendance':
      moduleHtml = renderAttendanceModule();
      break;
    case 'leaves':
      moduleHtml = renderLeavesModule();
      break;
    case 'performance':
      moduleHtml = renderPerformanceModule();
      break;
    case 'reports':
      moduleHtml = renderReportsModule();
      break;
    case 'settings':
      moduleHtml = renderSettingsModule();
      break;
    default:
      moduleHtml = renderDashboardModule();
  }

  root.innerHTML = renderAppShell(moduleHtml);
  window.scrollTo(0, 0);
}

// Global Nav Handlers
window.navigateApp = async function(viewName) {
  state.activeView = viewName;
  renderCurrentView();

  // Lazy load data for the active view
  if (state.user) {
    if (viewName === 'dashboard') loadDashboardData();
    if (viewName === 'employees') loadEmployeesData();
    if (viewName === 'departments') loadDepartmentsData();
    if (viewName === 'attendance') loadAttendanceData();
    if (viewName === 'leaves') loadLeavesData();
    if (viewName === 'performance') loadPerformanceData();
  }
};

window.fillCredentials = function(email) {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput && passInput) {
    emailInput.value = email;
    passInput.value = 'password123';
  }
};

window.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;

  if (btn) btn.innerText = 'Authenticating...';
  const res = await loginUser(email, pass);

  if (res.success) {
    showToast(`Welcome back, ${res.user.name}!`, 'success');
    window.navigateApp('dashboard');
  } else {
    showToast(res.message, 'error');
    if (btn) btn.innerText = 'Sign In to Workspace →';
  }
};

window.handleLogout = function() {
  logoutUser();
  showToast('Signed out of workspace', 'info');
  window.navigateApp('landing');
};

// Data Loaders
async function loadDashboardData() {
  const res = await apiRequest('/dashboard/stats');
  if (res.ok && res.data.stats) {
    state.stats = res.data.stats;
    if (state.activeView === 'dashboard') renderCurrentView();
  }
}

async function loadEmployeesData() {
  const res = await apiRequest('/employees');
  if (res.ok && res.data.data) {
    state.employees = res.data.data;
    if (state.activeView === 'employees') renderCurrentView();
  }
}

async function loadDepartmentsData() {
  const res = await apiRequest('/departments');
  if (res.ok && res.data.data) {
    state.departments = res.data.data;
    if (state.activeView === 'departments') renderCurrentView();
  }
}

async function loadAttendanceData() {
  const res = await apiRequest('/attendance');
  if (res.ok && res.data.data) {
    state.attendance = res.data.data;
    if (state.activeView === 'attendance') renderCurrentView();
  }
}

async function loadLeavesData() {
  const res = await apiRequest('/leaves');
  if (res.ok && res.data.data) {
    state.leaves = res.data.data;
    if (state.activeView === 'leaves') renderCurrentView();
  }
}

async function loadPerformanceData() {
  const res = await apiRequest('/performance');
  if (res.ok && res.data.data) {
    state.performance = res.data.data;
    if (state.activeView === 'performance') renderCurrentView();
  }
}

// Attendance Actions
window.triggerCheckIn = async function() {
  const res = await apiRequest('/attendance/check-in', {
    method: 'POST',
    body: JSON.stringify({ notes: 'Web Clock-in' })
  });
  if (res.ok) {
    showToast('Clocked in successfully!', 'success');
    loadAttendanceData();
  } else {
    showToast(res.data?.message || 'Check-in failed', 'error');
  }
};

window.triggerCheckOut = async function() {
  const res = await apiRequest('/attendance/check-out', {
    method: 'POST'
  });
  if (res.ok) {
    showToast('Clocked out successfully!', 'success');
    loadAttendanceData();
  } else {
    showToast(res.data?.message || 'Check-out failed', 'error');
  }
};

// Leaves Actions
window.updateLeave = async function(id, status) {
  const res = await apiRequest(`/leaves/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
  if (res.ok) {
    showToast(`Leave request ${status.toLowerCase()}!`, 'success');
    loadLeavesData();
  } else {
    showToast('Failed to update leave', 'error');
  }
};

// Search & Filter
window.filterEmployees = function() {
  const search = (document.getElementById('employeeSearchInput')?.value || '').toLowerCase();
  const dept = document.getElementById('employeeDeptFilter')?.value || 'All';
  const tbody = document.getElementById('employeeTableBody');
  if (!tbody) return;

  const filtered = state.employees.filter(emp => {
    const matchesSearch = (emp.name || '').toLowerCase().includes(search) ||
                          (emp.email || '').toLowerCase().includes(search) ||
                          (emp.designation || '').toLowerCase().includes(search);
    const matchesDept = dept === 'All' || emp.department === dept;
    return matchesSearch && matchesDept;
  });

  const canManage = state.user?.role === 'Admin' || state.user?.role === 'HR';
  tbody.innerHTML = filtered.map(emp => `
    <tr id="emp-row-${emp._id}">
      <td>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg, #4F46E5, #2563EB); color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">
            ${(emp.name || 'U').charAt(0)}
          </div>
          <div>
            <strong style="color:var(--text-main);">${emp.name}</strong>
            <div style="font-size:0.75rem; color:#64748B;">${emp.email}</div>
          </div>
        </div>
      </td>
      <td><div>${emp.designation || 'Specialist'}</div><span class="badge badge-info">${emp.role}</span></td>
      <td>${emp.department || 'General'}</td>
      <td>${emp.phone || '--'}</td>
      <td><span class="badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}">${emp.status || 'Active'}</span></td>
      ${canManage ? `
        <td>
          <div style="display:flex; gap:0.35rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.editEmployee('${emp._id}')">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="window.deleteEmployee('${emp._id}')">🗑️</button>
          </div>
        </td>
      ` : ''}
    </tr>
  `).join('');
};

// Modal Handlers
window.openAddEmployeeModal = function() {
  showModal('Add New Employee Record', `
    <form onsubmit="window.submitEmployeeForm(event, false)">
      <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="m_name" required class="form-control" /></div>
      <div class="form-group"><label class="form-label">Work Email</label><input type="email" id="m_email" required class="form-control" /></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Role</label>
          <select id="m_role" class="form-control">
            <option value="Employee">Employee</option><option value="Manager">Manager</option><option value="HR">HR</option><option value="Admin">Admin</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Department</label>
          <select id="m_dept" class="form-control">
            <option value="Engineering">Engineering</option><option value="Human Resources">Human Resources</option><option value="Product Management">Product Management</option><option value="Sales & Marketing">Sales & Marketing</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Job Title</label><input type="text" id="m_title" required class="form-control" /></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="text" id="m_phone" class="form-control" value="+1 (555) 234-5678" /></div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.25rem;">
        <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Employee</button>
      </div>
    </form>
  `);
};

window.editEmployee = function(id) {
  const emp = state.employees.find(e => e._id === id);
  if (!emp) return;

  showModal('Edit Employee Record', `
    <form onsubmit="window.submitEmployeeForm(event, true, '${id}')">
      <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="m_name" value="${emp.name}" required class="form-control" /></div>
      <div class="form-group"><label class="form-label">Work Email</label><input type="email" id="m_email" value="${emp.email}" required class="form-control" /></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Role</label>
          <select id="m_role" class="form-control">
            <option value="Employee" ${emp.role === 'Employee' ? 'selected' : ''}>Employee</option>
            <option value="Manager" ${emp.role === 'Manager' ? 'selected' : ''}>Manager</option>
            <option value="HR" ${emp.role === 'HR' ? 'selected' : ''}>HR</option>
            <option value="Admin" ${emp.role === 'Admin' ? 'selected' : ''}>Admin</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Department</label>
          <select id="m_dept" class="form-control">
            <option value="Engineering" ${emp.department === 'Engineering' ? 'selected' : ''}>Engineering</option>
            <option value="Human Resources" ${emp.department === 'Human Resources' ? 'selected' : ''}>Human Resources</option>
            <option value="Product Management" ${emp.department === 'Product Management' ? 'selected' : ''}>Product Management</option>
            <option value="Sales & Marketing" ${emp.department === 'Sales & Marketing' ? 'selected' : ''}>Sales & Marketing</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Job Title</label><input type="text" id="m_title" value="${emp.designation || ''}" required class="form-control" /></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="text" id="m_phone" value="${emp.phone || ''}" class="form-control" /></div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.25rem;">
        <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </div>
    </form>
  `);
};

window.submitEmployeeForm = async function(e, isEdit, id) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('m_name').value,
    email: document.getElementById('m_email').value,
    role: document.getElementById('m_role').value,
    department: document.getElementById('m_dept').value,
    designation: document.getElementById('m_title').value,
    phone: document.getElementById('m_phone').value
  };

  const res = await apiRequest(isEdit ? `/employees/${id}` : '/employees', {
    method: isEdit ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    showToast(isEdit ? 'Employee updated!' : 'Employee created!', 'success');
    window.closeModal();
    loadEmployeesData();
  } else {
    showToast(res.data?.message || 'Action failed', 'error');
  }
};

window.deleteEmployee = async function(id) {
  if (!confirm('Are you sure you want to deactivate and remove this employee record?')) return;
  const res = await apiRequest(`/employees/${id}`, { method: 'DELETE' });
  if (res.ok) {
    showToast('Employee removed successfully', 'success');
    loadEmployeesData();
  } else {
    showToast('Delete operation failed', 'error');
  }
};

window.openAddDeptModal = function() {
  showModal('Create Organizational Department', `
    <form onsubmit="window.submitDeptForm(event)">
      <div class="form-group"><label class="form-label">Department Name</label><input type="text" id="d_name" required class="form-control" placeholder="e.g. Finance & Accounting" /></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Code</label><input type="text" id="d_code" required class="form-control" placeholder="e.g. FIN" /></div>
        <div class="form-group"><label class="form-label">Head of Dept</label><input type="text" id="d_head" required class="form-control" placeholder="e.g. Marcus Wu" /></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Location</label><input type="text" id="d_loc" class="form-control" value="Building A, 2nd Floor" /></div>
        <div class="form-group"><label class="form-label">Budget ($)</label><input type="number" id="d_budget" class="form-control" value="200000" /></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label><textarea id="d_desc" rows="2" class="form-control"></textarea></div>
      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.25rem;">
        <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Create Department</button>
      </div>
    </form>
  `);
};

window.submitDeptForm = async function(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('d_name').value,
    code: document.getElementById('d_code').value,
    headOfDepartment: document.getElementById('d_head').value,
    location: document.getElementById('d_loc').value,
    budget: Number(document.getElementById('d_budget').value),
    description: document.getElementById('d_desc').value
  };

  const res = await apiRequest('/departments', { method: 'POST', body: JSON.stringify(payload) });
  if (res.ok) {
    showToast('Department added!', 'success');
    window.closeModal();
    loadDepartmentsData();
  } else {
    showToast(res.data?.message || 'Failed to add department', 'error');
  }
};

window.openApplyLeaveModal = function() {
  showModal('Submit Time-Off Application', `
    <form onsubmit="window.submitLeaveForm(event)">
      <div class="form-group">
        <label class="form-label">Leave Type</label>
        <select id="l_type" class="form-control">
          <option value="Paid Vacation">Paid Vacation</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Maternity/Paternity">Maternity/Paternity</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Start Date</label><input type="date" id="l_start" required class="form-control" /></div>
        <div class="form-group"><label class="form-label">End Date</label><input type="date" id="l_end" required class="form-control" /></div>
      </div>
      <div class="form-group"><label class="form-label">Total Days</label><input type="number" id="l_days" min="1" value="1" required class="form-control" /></div>
      <div class="form-group"><label class="form-label">Reason</label><textarea id="l_reason" required rows="3" class="form-control" placeholder="Planned family holiday..."></textarea></div>
      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.25rem;">
        <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Submit Request</button>
      </div>
    </form>
  `);
};

window.submitLeaveForm = async function(e) {
  e.preventDefault();
  const payload = {
    leaveType: document.getElementById('l_type').value,
    startDate: document.getElementById('l_start').value,
    endDate: document.getElementById('l_end').value,
    days: Number(document.getElementById('l_days').value),
    reason: document.getElementById('l_reason').value
  };

  const res = await apiRequest('/leaves', { method: 'POST', body: JSON.stringify(payload) });
  if (res.ok) {
    showToast('Leave request submitted!', 'success');
    window.closeModal();
    loadLeavesData();
  } else {
    showToast('Submission error', 'error');
  }
};

window.openAddReviewModal = function() {
  showModal('Record Performance Evaluation', `
    <form onsubmit="window.submitReviewForm(event)">
      <div class="form-group"><label class="form-label">Employee Name</label><input type="text" id="r_emp" required class="form-control" placeholder="Emily Davis" /></div>
      <div class="form-group"><label class="form-label">Objective / Goal Title</label><input type="text" id="r_title" required class="form-control" placeholder="Frontend Architecture Overhaul" /></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Cycle</label><input type="text" id="r_cycle" value="Q1 - 2026" class="form-control" /></div>
        <div class="form-group"><label class="form-label">Rating (1-5)</label>
          <select id="r_rating" class="form-control">
            <option value="5">5 - Exceptional</option>
            <option value="4" selected>4 - Exceeds Expectations</option>
            <option value="3">3 - Meets Requirements</option>
            <option value="2">2 - Needs Improvement</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Progress Percentage (%)</label><input type="number" id="r_prog" min="0" max="100" value="85" class="form-control" /></div>
      <div class="form-group"><label class="form-label">Review Feedback</label><textarea id="r_feed" required rows="3" class="form-control" placeholder="Detailed feedback..."></textarea></div>
      <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.25rem;">
        <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Save Evaluation</button>
      </div>
    </form>
  `);
};

window.submitReviewForm = async function(e) {
  e.preventDefault();
  const payload = {
    employeeName: document.getElementById('r_emp').value,
    goalTitle: document.getElementById('r_title').value,
    cycle: document.getElementById('r_cycle').value,
    rating: Number(document.getElementById('r_rating').value),
    kpiProgress: Number(document.getElementById('r_prog').value),
    feedback: document.getElementById('r_feed').value
  };

  const res = await apiRequest('/performance', { method: 'POST', body: JSON.stringify(payload) });
  if (res.ok) {
    showToast('Performance review recorded!', 'success');
    window.closeModal();
    loadPerformanceData();
  } else {
    showToast('Error saving review', 'error');
  }
};

// CSV Export
window.exportCSV = function(type) {
  let content = '';
  let filename = '';

  if (type === 'payroll') {
    content = 'Employee ID,Name,Department,Designation,Annual Salary\n' +
              'EMP001,Alexander Wright,Engineering,Chief Technology Officer,$165000\n' +
              'EMP002,Sarah Jenkins,Human Resources,Head of People Operations,$110000\n' +
              'EMP003,Liam Vance,Engineering,Engineering Lead,$125000\n' +
              'EMP004,Emily Davis,Engineering,Senior Frontend Engineer,$92000\n' +
              'EMP005,Noah Patel,Product Management,Product Analyst,$84000\n';
    filename = 'NEXORA_HR_Payroll_Summary.csv';
  } else if (type === 'attendance') {
    content = 'Date,Employee,Status,Check In,Check Out,Work Hours\n' +
              '2026-10-25,Emily Davis,Present,09:05 AM,05:45 PM,8.5\n' +
              '2026-10-25,Noah Patel,Late,09:42 AM,--,7.2\n' +
              '2026-10-24,Liam Vance,Present,08:50 AM,06:10 PM,9.0\n';
    filename = 'NEXORA_HR_Attendance_Audit.csv';
  } else {
    content = 'Employee,Cycle,Goal,Rating,Progress\n' +
              'Emily Davis,Q1-2026,UI Architecture Modernization,5/5,92%\n' +
              'Noah Patel,Q1-2026,Product User Journey Mapping,4/5,75%\n';
    filename = 'NEXORA_HR_Performance_Evaluations.csv';
  }

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast(`Exported ${filename}`, 'success');
};

// Modal Helper
function showModal(title, bodyHtml) {
  let modal = document.getElementById('genericModal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'genericModal';
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal-content-card">
      <div class="modal-header-bar">
        <h3 style="font-size:1.15rem; font-weight:700;">${title}</h3>
        <button onclick="window.closeModal()" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">✕</button>
      </div>
      <div class="modal-body-area">${bodyHtml}</div>
    </div>
  `;
  document.body.appendChild(modal);
}

window.closeModal = function() {
  const modal = document.getElementById('genericModal');
  if (modal) modal.remove();
};

window.handleSettingsSave = function(e) {
  e.preventDefault();
  if (state.user) {
    state.user.name = document.getElementById('profileName').value;
    state.user.designation = document.getElementById('profileTitle').value;
    state.user.phone = document.getElementById('profilePhone').value;
    localStorage.setItem('nexora_user', JSON.stringify(state.user));
    showToast('Profile updated successfully!', 'success');
    renderCurrentView();
  }
};

// Application Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  // If user was logged in previously, launch dashboard
  if (state.user && state.token) {
    state.activeView = 'dashboard';
    renderCurrentView();
    loadDashboardData();
  } else {
    state.activeView = 'landing';
    renderCurrentView();
  }
});
