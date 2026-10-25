/**
 * NEXORA HR — Vanilla ES6+ State & API Client
 * "Empower People. Elevate Performance."
 */

export const API_BASE = '/api';

export const state = {
  user: JSON.parse(localStorage.getItem('nexora_user') || 'null'),
  token: localStorage.getItem('nexora_token') || null,
  activeView: 'landing', // 'landing', 'login', 'dashboard', 'employees', 'departments', 'attendance', 'leaves', 'performance', 'reports', 'settings'
  stats: null,
  employees: [],
  departments: [],
  attendance: [],
  leaves: [],
  performance: [],
  notifications: [
    { id: 1, title: 'Q1 Review Cycle Live', text: 'Performance evaluations are open for submission.', time: '2h ago', read: false },
    { id: 2, title: 'Leave Approval', text: 'Your time-off request was approved by HR.', time: '1d ago', read: true }
  ]
};

// Generic Fetch Wrapper
export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return { ok: false, status: 500, error: error.message };
  }
}

// Authentication Handlers
export async function loginUser(email, password) {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (res.ok && res.data.success) {
    state.user = res.data.user;
    state.token = res.data.token;
    localStorage.setItem('nexora_user', JSON.stringify(res.data.user));
    localStorage.setItem('nexora_token', res.data.token);
    return { success: true, user: res.data.user };
  }
  return { success: false, message: res.data?.message || 'Login failed' };
}

export function logoutUser() {
  state.user = null;
  state.token = null;
  localStorage.removeItem('nexora_user');
  localStorage.removeItem('nexora_token');
  state.activeView = 'landing';
}

// Toast Helper
export function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
