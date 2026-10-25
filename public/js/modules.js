/**
 * NEXORA HR — Domain Module Renderers (Dashboard, Employees, Departments, Attendance, Leaves, Performance, Reports, Settings)
 */

import { state } from './api.js';

/* 1. Dashboard View */
export function renderDashboardModule() {
  const stats = state.stats || {
    totalEmployees: 5,
    activeEmployees: 5,
    totalDepartments: 4,
    presentToday: 4,
    pendingLeaves: 1,
    attendanceRate: 95,
    averagePerformance: 4.4
  };
  const user = state.user || {};

  return `
    <div style="background:linear-gradient(135deg, #0F172A, #1E293B); border-radius:16px; padding:1.75rem; color:#FFFFFF; margin-bottom:1.75rem; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
      <div>
        <h1 style="font-size:1.5rem; font-weight:800; color:#FFF; margin-bottom:0.25rem;">
          Welcome back, ${user.name} 👋
        </h1>
        <p style="color:#94A3B8; font-size:0.875rem;">
          Authorized as <strong style="color:#38BDF8;">${user.role}</strong> (${user.department} Department) — System Active
        </p>
      </div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="window.navigateApp('attendance')">⏱️ Shift Clock In/Out</button>
        <button class="btn btn-secondary btn-sm" onclick="window.navigateApp('leaves')">🌴 Apply Leave</button>
      </div>
    </div>

    <div class="metrics-row">
      <div class="metric-card">
        <div class="metric-icon-box" style="background:#EEF2FF; color:#4F46E5;">👥</div>
        <div>
          <div class="metric-val">${stats.totalEmployees || 0}</div>
          <div class="metric-label">Total Workforce</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box" style="background:#ECFDF5; color:#10B981;">🏢</div>
        <div>
          <div class="metric-val">${stats.totalDepartments || 0}</div>
          <div class="metric-label">Active Departments</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box" style="background:#FEF3C7; color:#D97706;">⏱️</div>
        <div>
          <div class="metric-val">${stats.presentToday || 0} (${stats.attendanceRate || 95}%)</div>
          <div class="metric-label">Present Today</div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box" style="background:#F0FDFA; color:#14B8A6;">⭐</div>
        <div>
          <div class="metric-val">${stats.averagePerformance || 4.4} / 5.0</div>
          <div class="metric-label">Org Performance Score</div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
      <div class="content-panel">
        <div class="panel-header">
          <h3 class="panel-title">Role-Based Quick Workflows</h3>
          <span class="badge badge-info">${user.role}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${user.role === 'Admin' || user.role === 'HR' ? `
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="window.navigateApp('employees')">➕ Add or Update Employee Record</button>
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="window.navigateApp('departments')">🏢 Allocate Department Budgets</button>
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="window.navigateApp('leaves')">📋 Process Pending Leaves (${stats.pendingLeaves || 0})</button>
          ` : user.role === 'Manager' ? `
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="window.navigateApp('performance')">🎯 Submit Employee Performance Reviews</button>
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="window.navigateApp('attendance')">⏱️ Monitor Team Daily Attendance</button>
          ` : `
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="window.navigateApp('attendance')">⏱️ View My Shift Clock History</button>
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="window.navigateApp('performance')">📈 Check Assigned KPI Milestones</button>
          `}
        </div>
      </div>

      <div class="content-panel">
        <div class="panel-header">
          <h3 class="panel-title">Workforce Attendance Audit</h3>
          <span class="badge badge-success">Live Track</span>
        </div>
        <p style="font-size:0.875rem; color:#64748B; margin-bottom:1rem;">Shift punctuality compliance for current evaluation period.</p>
        <div style="margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600;">
            <span>On-Time Compliance</span>
            <span>92%</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:92%;"></div></div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600;">
            <span>Late Registrations</span>
            <span>8%</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:8%; background:#D97706;"></div></div>
        </div>
      </div>
    </div>
  `;
}

/* 2. Employee Directory Module */
export function renderEmployeesModule() {
  const employees = state.employees || [];
  const user = state.user || {};
  const canManage = user.role === 'Admin' || user.role === 'HR';

  return `
    <div class="content-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Workforce Directory</h2>
          <p style="font-size:0.875rem; color:#64748B;">Search, filter, view and maintain authorized personnel records.</p>
        </div>
        ${canManage ? `
          <button class="btn btn-primary" onclick="window.openAddEmployeeModal()">➕ Add New Employee</button>
        ` : ''}
      </div>

      <!-- Filters -->
      <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1.25rem;">
        <input type="text" id="employeeSearchInput" class="form-control" style="flex:1; min-width:240px;" placeholder="🔍 Search by name, title, or email..." oninput="window.filterEmployees()" />
        <select id="employeeDeptFilter" class="form-control" style="width:200px;" onchange="window.filterEmployees()">
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Product Management">Product Management</option>
          <option value="Sales & Marketing">Sales & Marketing</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-responsive-box">
        <table class="data-grid-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role & Designation</th>
              <th>Department</th>
              <th>Contact Phone</th>
              <th>Status</th>
              ${canManage ? '<th>Actions</th>' : ''}
            </tr>
          </thead>
          <tbody id="employeeTableBody">
            ${employees.map(emp => `
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
                <td>
                  <div>${emp.designation || 'Specialist'}</div>
                  <span class="badge badge-info">${emp.role}</span>
                </td>
                <td>${emp.department || 'General'}</td>
                <td>${emp.phone || '--'}</td>
                <td>
                  <span class="badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}">${emp.status || 'Active'}</span>
                </td>
                ${canManage ? `
                  <td>
                    <div style="display:flex; gap:0.35rem;">
                      <button class="btn btn-secondary btn-sm" onclick="window.editEmployee('${emp._id}')">✏️ Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="window.deleteEmployee('${emp._id}')">🗑️</button>
                    </div>
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* 3. Departments Module */
export function renderDepartmentsModule() {
  const departments = state.departments || [];
  const user = state.user || {};
  const canManage = user.role === 'Admin' || user.role === 'HR';

  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title">Organizational Divisions & Departments</h2>
        <p style="font-size:0.875rem; color:#64748B;">Structure business operational units, appointed heads, and annual budgets.</p>
      </div>
      ${canManage ? `
        <button class="btn btn-primary" onclick="window.openAddDeptModal()">➕ Create Department</button>
      ` : ''}
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(310px, 1fr)); gap:1.25rem; margin-top:1.25rem;">
      ${departments.map(dept => `
        <div class="content-panel" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div>
              <span class="badge badge-info" style="margin-bottom:0.35rem;">${dept.code || 'UNIT'}</span>
              <h3 style="font-size:1.15rem; font-weight:700;">${dept.name}</h3>
            </div>
            <span class="badge badge-success">${dept.memberCount || 5} Members</span>
          </div>
          <p style="font-size:0.85rem; color:#64748B; margin-bottom:1.25rem;">${dept.description || 'Core business division.'}</p>
          <div style="border-top:1px solid #E2E8F0; padding-top:0.85rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem;">
            <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Head of Dept:</span><strong>${dept.headOfDepartment || 'Assigned Lead'}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Location:</span><span>${dept.location || 'Headquarters'}</span></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:#64748B;">Budget:</span><strong style="color:#16A34A;">$${(dept.budget || 150000).toLocaleString()}</strong></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* 4. Attendance Module */
export function renderAttendanceModule() {
  const records = state.attendance || [];

  return `
    <div class="content-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Workforce Attendance & Shift Clock-In</h2>
          <p style="font-size:0.875rem; color:#64748B;">Record daily shift arrival and departure timestamps with automated auditing.</p>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-success" onclick="window.triggerCheckIn()">🟢 Clock In</button>
          <button class="btn btn-danger" onclick="window.triggerCheckOut()">🔴 Clock Out</button>
        </div>
      </div>
    </div>

    <div class="content-panel">
      <h3 class="panel-title" style="margin-bottom:1rem;">Shift Logs History</h3>
      <div class="table-responsive-box">
        <table class="data-grid-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Work Hours</th>
              <th>Status</th>
              <th>Shift Notes</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(rec => `
              <tr>
                <td><strong>${rec.userName}</strong></td>
                <td>${rec.date}</td>
                <td style="color:#16A34A; font-weight:600;">${rec.checkIn || '--'}</td>
                <td style="color:#DC2626; font-weight:600;">${rec.checkOut || '--'}</td>
                <td>${rec.workHours ? rec.workHours + ' hrs' : 'In Progress'}</td>
                <td>
                  <span class="badge ${rec.status === 'Present' ? 'badge-success' : rec.status === 'Late' ? 'badge-warning' : 'badge-danger'}">
                    ${rec.status}
                  </span>
                </td>
                <td style="font-size:0.8rem; color:#64748B;">${rec.notes || 'Shift Clock'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* 5. Leaves Module */
export function renderLeavesModule() {
  const leaves = state.leaves || [];
  const user = state.user || {};
  const canApprove = user.role === 'Admin' || user.role === 'HR' || user.role === 'Manager';

  return `
    <div class="metrics-row">
      <div class="metric-card">
        <div class="metric-icon-box" style="background:#ECFDF5; color:#10B981;">🌴</div>
        <div><div class="metric-val">15 Days</div><div class="metric-label">Paid Annual Balance</div></div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box" style="background:#EEF2FF; color:#4F46E5;">🩹</div>
        <div><div class="metric-val">8 Days</div><div class="metric-label">Sick Leave Balance</div></div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box" style="background:#FEF3C7; color:#D97706;">☕</div>
        <div><div class="metric-val">4 Days</div><div class="metric-label">Casual Available</div></div>
      </div>
    </div>

    <div class="content-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Leave Applications & Approval Queues</h2>
          <p style="font-size:0.875rem; color:#64748B;">Request scheduled time off and manage organizational approvals.</p>
        </div>
        <button class="btn btn-primary" onclick="window.openApplyLeaveModal()">✈️ Request Leave</button>
      </div>

      <div class="table-responsive-box">
        <table class="data-grid-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Category</th>
              <th>Schedule</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              ${canApprove ? '<th>Actions</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${leaves.map(l => `
              <tr>
                <td><strong>${l.userName}</strong></td>
                <td>${l.leaveType}</td>
                <td>${l.startDate} to ${l.endDate}</td>
                <td><strong>${l.days} day(s)</strong></td>
                <td style="max-width:220px; font-size:0.825rem;">${l.reason}</td>
                <td>
                  <span class="badge ${l.status === 'Approved' ? 'badge-success' : l.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}">
                    ${l.status}
                  </span>
                </td>
                ${canApprove ? `
                  <td>
                    ${l.status === 'Pending' ? `
                      <div style="display:flex; gap:0.35rem;">
                        <button class="btn btn-success btn-sm" onclick="window.updateLeave('${l._id}', 'Approved')">Approve</button>
                        <button class="btn btn-danger btn-sm" onclick="window.updateLeave('${l._id}', 'Rejected')">Reject</button>
                      </div>
                    ` : `<span style="font-size:0.8rem; color:#64748B;">Reviewed</span>`}
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* 6. Performance Module */
export function renderPerformanceModule() {
  const reviews = state.performance || [];
  const user = state.user || {};
  const canReview = user.role === 'Admin' || user.role === 'HR' || user.role === 'Manager';

  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title">Performance Objectives & KPI Reviews</h2>
        <p style="font-size:0.875rem; color:#64748B;">Track milestone attainment, review cycles, and qualitative manager feedback.</p>
      </div>
      ${canReview ? `
        <button class="btn btn-primary" onclick="window.openAddReviewModal()">🎯 Record Review / KPI</button>
      ` : ''}
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(330px, 1fr)); gap:1.25rem; margin-top:1.25rem;">
      ${reviews.map(rev => `
        <div class="content-panel" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span class="badge badge-info">${rev.cycle || 'Q1 - 2026'}</span>
            <div style="color:#D97706; font-weight:700;">
              ${'★'.repeat(rev.rating || 4)}${'☆'.repeat(5 - (rev.rating || 4))} (${rev.rating || 4}/5)
            </div>
          </div>
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:0.3rem;">${rev.goalTitle}</h3>
          <p style="font-size:0.85rem; color:#64748B; margin-bottom:1rem;">
            Employee: <strong>${rev.employeeName}</strong> • Evaluator: ${rev.reviewerName || 'Leadership'}
          </p>
          <div style="margin-bottom:1rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;">
              <span>KPI Milestone Progress</span>
              <span style="color:#4F46E5;">${rev.kpiProgress || 80}%</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${rev.kpiProgress || 80}%;"></div></div>
          </div>
          <div style="background:#F8FAFC; padding:0.85rem; border-radius:8px; border:1px solid #E2E8F0; font-size:0.85rem; font-style:italic;">
            “${rev.feedback || 'Consistent solid performance.'}”
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* 7. Reports Module */
export function renderReportsModule() {
  return `
    <div class="panel-header">
      <div>
        <h2 class="panel-title">Executive Reports & Data Export</h2>
        <p style="font-size:0.875rem; color:#64748B;">Export verified operational, attendance, and payroll records to CSV format.</p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-top:1.25rem;">
      <div class="content-panel">
        <div style="font-size:2rem; margin-bottom:0.75rem;">💵</div>
        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.35rem;">Workforce Payroll Distribution</h3>
        <p style="font-size:0.85rem; color:#64748B; margin-bottom:1.25rem;">Consolidated monthly base wages, annual salaries, and department pay allocations.</p>
        <button class="btn btn-primary" onclick="window.exportCSV('payroll')">📥 Download Payroll CSV</button>
      </div>

      <div class="content-panel">
        <div style="font-size:2rem; margin-bottom:0.75rem;">⏱️</div>
        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.35rem;">Attendance & Shift Audit Log</h3>
        <p style="font-size:0.85rem; color:#64748B; margin-bottom:1.25rem;">Daily check-in / check-out timestamps, overtime hours, and punctuality logs.</p>
        <button class="btn btn-primary" onclick="window.exportCSV('attendance')">📥 Download Attendance CSV</button>
      </div>

      <div class="content-panel">
        <div style="font-size:2rem; margin-bottom:0.75rem;">⭐</div>
        <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.35rem;">Performance Reviews & KPIs</h3>
        <p style="font-size:0.85rem; color:#64748B; margin-bottom:1.25rem;">Appraisal scores, milestone completions, and manager assessment records.</p>
        <button class="btn btn-primary" onclick="window.exportCSV('performance')">📥 Download Performance CSV</button>
      </div>
    </div>
  `;
}

/* 8. Settings Module */
export function renderSettingsModule() {
  const user = state.user || {};

  return `
    <div class="content-panel" style="max-width:800px; margin:0 auto;">
      <h2 class="panel-title" style="font-size:1.35rem; margin-bottom:0.25rem;">Profile & Account Settings</h2>
      <p style="font-size:0.875rem; color:#64748B; margin-bottom:1.5rem;">Manage personal contact information, workspace preferences, and security.</p>

      <form onsubmit="window.handleSettingsSave(event)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" id="profileName" value="${user.name || ''}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" value="${user.email || ''}" disabled style="background:#F1F5F9;" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">System Role</label>
            <input type="text" class="form-control" value="${user.role || ''}" disabled style="background:#F1F5F9;" />
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Department</label>
            <input type="text" class="form-control" value="${user.department || ''}" disabled style="background:#F1F5F9;" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Designation / Title</label>
            <input type="text" class="form-control" id="profileTitle" value="${user.designation || 'Specialist'}" />
          </div>
          <div class="form-group">
            <label class="form-label">Phone Contact</label>
            <input type="text" class="form-control" id="profilePhone" value="${user.phone || '+1 (555) 019-2834'}" />
          </div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:flex-end;">
          <button type="submit" class="btn btn-primary">💾 Save Profile Preferences</button>
        </div>
      </form>
    </div>
  `;
}
