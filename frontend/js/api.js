// Relative path — works on Railway (https://yourapp.railway.app) AND localhost:3000
const API_BASE = '/api';

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/* ── Toast ────────────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ── Modal helpers ─────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id).classList.add('show'); }
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  const form = document.querySelector(`#${id} form`);
  if (form) form.reset();
}

/* ── Badge helper ──────────────────────────────────────────────── */
function statusBadge(status) {
  const map = {
    'Available':   ['success',   '●'],
    'Unavailable': ['secondary', '●'],
    'Scheduled':   ['info',      '◷'],
    'Completed':   ['success',   '✓'],
    'Cancelled':   ['secondary', '✕'],
    'Pending':     ['warning',   '◉'],
    'Approved':    ['info',      '✓'],
    'Fulfilled':   ['success',   '✓'],
    'Rejected':    ['danger',    '✕'],
    'Critical':    ['danger',    '⚡'],
  };
  const [cls, icon] = map[status] || ['secondary', '●'];
  return `<span class="badge badge-${cls}">${icon} ${status}</span>`;
}

/* ── Format date ───────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '<span style="color:var(--text3)">—</span>';
  return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

/* ── Avatar ────────────────────────────────────────────────────── */
function avatar(name, color = 'var(--danger-bg)', textColor = 'var(--red)') {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return `<div class="avatar" style="background:${color};color:${textColor}">${initials}</div>`;
}

/* ── Set active nav link ───────────────────────────────────────── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}
document.addEventListener('DOMContentLoaded', setActiveNav);
