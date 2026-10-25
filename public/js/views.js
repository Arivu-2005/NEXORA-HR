/**
 * NEXORA HR — Page Views & Component Renderers
 * Pure HTML5 string template generators with real database bindings
 */

import { state } from './api.js';

/* 1. Public Landing Page */
export function renderLandingPage() {
  return `
    <nav class="landing-nav">
      <div class="nav-container">
        <a href="#hero" class="brand-link">
          <div class="brand-symbol">N</div>
          <div class="brand-title">NEXORA<span> HR</span></div>
        </a>
        <ul class="nav-menu">
          <li><a href="#features">Features</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div style="display:flex; gap:0.75rem; align-items:center;">
          ${state.user ? `
            <button class="btn btn-primary" onclick="window.navigateApp('dashboard')">Open Workspace →</button>
          ` : `
            <button class="btn btn-secondary" onclick="window.navigateApp('login')">Sign In</button>
            <button class="btn btn-primary" onclick="window.navigateApp('login')">Get Started Free</button>
          `}
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section" id="hero">
      <div class="hero-pill">
        <span>✨ Modern Human Capital & Performance Platform</span>
      </div>
      <h1 class="hero-title">
        Empower People. <br/><span class="highlight">Elevate Performance.</span>
      </h1>
      <p class="hero-subtitle">
        A unified enterprise HR management suite designed to automate workforce directories, daily attendance tracking, agile KPI reviews, and departmental approvals.
      </p>
      <div class="hero-cta">
        <button class="btn btn-primary btn-lg" onclick="window.navigateApp('${state.user ? 'dashboard' : 'login'}')">
          ${state.user ? 'Enter HR Dashboard' : 'Explore Platform Now'}
        </button>
        <a href="#features" class="btn btn-secondary btn-lg">Explore All Features ↓</a>
      </div>

      <!-- Preview Mockup -->
      <div class="preview-mockup-wrapper">
        <div class="mockup-header-bar">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-left:0.5rem; font-weight:600;">nexora-hr-system.internal/dashboard</span>
        </div>
        <div style="background:#F8FAFC; border-radius:8px; padding:1.5rem; text-align:left;">
          <div class="metrics-row" style="margin-bottom:1rem;">
            <div class="metric-card" style="padding:1rem;">
              <div class="metric-icon-box" style="background:#EEF2FF; color:#4F46E5;">👥</div>
              <div><div class="metric-val" style="font-size:1.4rem;">48</div><div class="metric-label">Total Workforce</div></div>
            </div>
            <div class="metric-card" style="padding:1rem;">
              <div class="metric-icon-box" style="background:#ECFDF5; color:#10B981;">⏱️</div>
              <div><div class="metric-val" style="font-size:1.4rem;">95%</div><div class="metric-label">Punctuality Rate</div></div>
            </div>
            <div class="metric-card" style="padding:1rem;">
              <div class="metric-icon-box" style="background:#FEF3C7; color:#D97706;">⭐</div>
              <div><div class="metric-val" style="font-size:1.4rem;">4.4 / 5.0</div><div class="metric-label">Performance Avg</div></div>
            </div>
          </div>
          <div style="font-size:0.875rem; color:#64748B; background:#FFFFFF; padding:1rem; border-radius:8px; border:1px solid #E2E8F0;">
            <strong>Recent Update:</strong> Q1 Performance review cycle is currently active with 92% milestone completion rate.
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section-wrapper" id="features">
      <div class="section-header">
        <span class="section-tag">Enterprise Capabilities</span>
        <h2 class="section-title">Built for Modern High-Growth Teams</h2>
        <p style="max-width:600px; margin:0.75rem auto 0;">From onboarding talent to evaluating strategic objectives, NEXORA HR powers the complete employee lifecycle.</p>
      </div>

      <div class="features-grid">
        <div class="feature-box">
          <div class="feature-icon-wrapper" style="background:#EEF2FF; color:#4F46E5;">👥</div>
          <h3 class="feature-title">Employee Directory</h3>
          <p>Instant search, department filters, reporting structures, compensation bands, and comprehensive staff profile cards.</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon-wrapper" style="background:#ECFDF5; color:#10B981;">⏱️</div>
          <h3 class="feature-title">Shift Attendance</h3>
          <p>One-click clock-in / clock-out logging with automated shift hour calculation, late flags, and attendance auditing.</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon-wrapper" style="background:#FEF3C7; color:#D97706;">🌴</div>
          <h3 class="feature-title">Time-Off & Leaves</h3>
          <p>Structured leave quotas (Paid, Sick, Casual), automated request submissions, and manager approval queues.</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon-wrapper" style="background:#F0FDFA; color:#14B8A6;">🎯</div>
          <h3 class="feature-title">KPI & Goal Tracking</h3>
          <p>Measurable objective tracking, progress meters, milestone evaluation, and transparent manager feedback.</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon-wrapper" style="background:#FDF2F8; color:#DB2777;">🏢</div>
          <h3 class="feature-title">Department Matrix</h3>
          <p>Define functional units, cost centers, budget allocations, department heads, and headcount ratios.</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon-wrapper" style="background:#F5F3FF; color:#7C3AED;">📑</div>
          <h3 class="feature-title">Executive Exports</h3>
          <p>Download structured CSV reports for payroll distribution, attendance compliance, and appraisal evaluations.</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section-wrapper" id="how-it-works" style="background:#F8FAFC; border-top:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0;">
      <div class="section-header">
        <span class="section-tag">Seamless Onboarding</span>
        <h2 class="section-title">How NEXORA HR Works</h2>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">01</div>
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Configure Org Units</h3>
          <p>Set up departments, budget parameters, and assign division leaders within minutes.</p>
        </div>
        <div class="step-card">
          <div class="step-number">02</div>
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Invite Team Members</h3>
          <p>Onboard employees with pre-assigned RBAC roles (Admin, HR, Manager, or Employee).</p>
        </div>
        <div class="step-card">
          <div class="step-number">03</div>
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Automate Daily Work</h3>
          <p>Track attendance timestamps, process leave workflows, and assign key performance targets.</p>
        </div>
        <div class="step-card">
          <div class="step-number">04</div>
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">Review & Elevate</h3>
          <p>Conduct objective evaluations with real ratings and export compliance data instantly.</p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section-wrapper" id="faq">
      <div class="section-header">
        <span class="section-tag">Frequently Asked Questions</span>
        <h2 class="section-title">Common Questions Answered</h2>
      </div>
      <div class="faq-list">
        <div class="faq-item open" onclick="this.classList.toggle('open')">
          <div class="faq-question">What roles are supported in NEXORA HR? <span>▾</span></div>
          <div class="faq-answer">NEXORA HR features full Role-Based Access Control (RBAC) with 4 specialized roles: Administrator (Full Access), HR Specialist (People & Organization), Manager (Team Evaluation & Leaves), and Employee (Self-Service).</div>
        </div>
        <div class="faq-item" onclick="this.classList.toggle('open')">
          <div class="faq-question">Is the data stored securely? <span>▾</span></div>
          <div class="faq-answer">Yes! Passwords are encrypted with standard bcrypt salt rounds, endpoints are protected with signed JWT authorization tokens, and all inputs are validated server-side.</div>
        </div>
        <div class="faq-item" onclick="this.classList.toggle('open')">
          <div class="faq-question">Can I export reports for payroll and audits? <span>▾</span></div>
          <div class="faq-answer">Yes. The Reports module provides one-click CSV downloads for workforce payroll bands, attendance shift audit logs, and performance evaluation metrics.</div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-container">
        <div class="footer-col">
          <div class="brand-link" style="margin-bottom:1rem;">
            <div class="brand-symbol">N</div>
            <div class="brand-title" style="color:#FFF;">NEXORA<span style="color:var(--accent);"> HR</span></div>
          </div>
          <p style="font-size:0.875rem; color:#94A3B8; max-width:320px;">
            “Empower People. Elevate Performance.” — The modern standard in cloud workforce operations and employee excellence.
          </p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Employee Directory</a></li>
            <li><a href="#features">Attendance Logging</a></li>
            <li><a href="#features">Leave Approval</a></li>
            <li><a href="#features">Performance KPIs</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Organization</h4>
          <ul>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#faq">Security & RBAC</a></li>
            <li><a href="#faq">Privacy Policy</a></li>
            <li><a href="#faq">Contact Support</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Quick Access</h4>
          <ul>
            <li><a href="javascript:void(0)" onclick="window.navigateApp('login')">Sign In to Portal</a></li>
            <li><a href="https://github.com/Arivu-2005/NEXORA-HR" target="_blank">GitHub Repository</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© 2026 NEXORA HR. All rights reserved.</div>
        <div>Official Tagline: <em>“Empower People. Elevate Performance.”</em></div>
      </div>
    </footer>
  `;
}

/* 2. Login Page */
export function renderLoginPage() {
  return `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1.5rem; background:radial-gradient(circle at top right, #1E1B4B, #0F172A 70%);">
      <div style="background:#FFFFFF; border-radius:16px; padding:2.5rem; max-width:460px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);">
        <div style="text-align:center; margin-bottom:2rem;">
          <div style="display:inline-flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem;">
            <div class="brand-symbol" style="width:42px; height:42px; font-size:1.35rem;">N</div>
            <span style="font-size:1.6rem; font-weight:800; color:#0F172A;">NEXORA <span style="color:#14B8A6;">HR</span></span>
          </div>
          <p style="color:#4F46E5; font-weight:700; font-size:0.95rem; margin-top:0.3rem;">“Empower People. Elevate Performance.”</p>
          <p style="font-size:0.875rem; color:#64748B; margin-top:0.25rem;">Enterprise Portal Authentication</p>
        </div>

        <form id="loginForm" onsubmit="window.handleLoginSubmit(event)">
          <div class="form-group">
            <label class="form-label">Work Email</label>
            <input type="email" id="loginEmail" required class="form-control" value="admin@nexora.com" placeholder="name@company.com" />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="loginPassword" required class="form-control" value="password123" placeholder="••••••••" />
          </div>
          <button type="submit" id="loginBtn" class="btn btn-primary btn-block" style="padding:0.75rem; font-size:0.95rem; margin-top:0.75rem;">
            Sign In to Workspace →
          </button>
        </form>

        <div style="background:#F1F5F9; border-radius:8px; padding:1rem; margin-top:1.5rem; font-size:0.8125rem;">
          <div style="font-weight:700; color:#0F172A; margin-bottom:0.4rem;">Quick Role Switcher (Password: <code>password123</code>):</div>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.fillCredentials('admin@nexora.com')">Admin</button>
            <button class="btn btn-secondary btn-sm" onclick="window.fillCredentials('hr@nexora.com')">HR</button>
            <button class="btn btn-secondary btn-sm" onclick="window.fillCredentials('manager@nexora.com')">Manager</button>
            <button class="btn btn-secondary btn-sm" onclick="window.fillCredentials('employee@nexora.com')">Employee</button>
          </div>
        </div>

        <div style="text-align:center; margin-top:1.5rem;">
          <a href="javascript:void(0)" onclick="window.navigateApp('landing')" style="font-size:0.875rem; color:#64748B; font-weight:500;">← Back to Landing Page</a>
        </div>
      </div>
    </div>
  `;
}

/* 3. Main Application Shell */
export function renderAppShell(contentHtml) {
  const user = state.user || {};
  const role = user.role || 'Employee';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'employees', label: 'Employee Directory', icon: '👥', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'departments', label: 'Departments', icon: '🏢', roles: ['Admin', 'HR', 'Manager'] },
    { id: 'attendance', label: 'Attendance Tracking', icon: '⏱️', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'leaves', label: 'Leave & Time Off', icon: '🌴', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'performance', label: 'Performance & KPIs', icon: '🎯', roles: ['Admin', 'HR', 'Manager', 'Employee'] },
    { id: 'reports', label: 'Reports & Export', icon: '📑', roles: ['Admin', 'HR', 'Manager'] },
    { id: 'settings', label: 'Profile & Settings', icon: '⚙️', roles: ['Admin', 'HR', 'Manager', 'Employee'] }
  ];

  const allowedNav = navItems.filter(item => item.roles.includes(role));

  return `
    <div class="app-container">
      <!-- Sidebar -->
      <aside class="app-sidebar" id="appSidebar">
        <div class="sidebar-brand-box">
          <div class="brand-link" style="cursor:pointer;" onclick="window.navigateApp('dashboard')">
            <div class="brand-symbol" style="width:34px; height:34px; font-size:1.1rem;">N</div>
            <div class="brand-title" style="font-size:1.15rem;">NEXORA<span> HR</span></div>
          </div>
          <button class="mobile-menu-btn" onclick="document.getElementById('appSidebar').classList.remove('open')">✕</button>
        </div>

        <ul class="sidebar-nav-list">
          ${allowedNav.map(item => `
            <li>
              <button class="sidebar-nav-item ${state.activeView === item.id ? 'active' : ''}" onclick="window.navigateApp('${item.id}')">
                <span>${item.icon}</span>
                <span>${item.label}</span>
              </button>
            </li>
          `).join('')}
        </ul>

        <div class="sidebar-user-card">
          <div class="user-meta-info">
            <div class="user-full-name">${user.name || 'User'}</div>
            <div class="user-role-text">${user.role} • ${user.department || 'Staff'}</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.handleLogout()" title="Sign Out">🚪</button>
        </div>
      </aside>

      <!-- Main Workspace -->
      <div class="app-main">
        <header class="app-topbar">
          <div class="topbar-left">
            <button class="mobile-menu-btn" onclick="document.getElementById('appSidebar').classList.toggle('open')">☰</button>
            <div>
              <h2 style="font-size:1.15rem; font-weight:700; text-transform:capitalize;">${state.activeView} Overview</h2>
              <span style="font-size:0.8rem; color:#64748B; font-style:italic;">“Empower People. Elevate Performance.”</span>
            </div>
          </div>
          <div class="topbar-right">
            <span class="badge badge-info">${user.role} Portal</span>
            <button class="btn btn-secondary btn-sm" onclick="window.navigateApp('landing')">Landing Page</button>
          </div>
        </header>

        <main class="workspace-content">
          ${contentHtml}
        </main>
      </div>
    </div>
  `;
}
