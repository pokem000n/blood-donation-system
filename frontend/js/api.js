/* ── Shared fetch helper ─────────────────────────────────────── */
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

/* ── Toast notification ──────────────────────────────────────── */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ── Modal helpers ───────────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.add('show');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  // Clear the form inside
  const form = document.querySelector(`#${id} form`);
  if (form) form.reset();
}

/* ── Badge helper ─────────────────────────────────────────────── */
function statusBadge(status) {
  const map = {
    'Available':   'success',
    'Unavailable': 'secondary',
    'Scheduled':   'info',
    'Completed':   'success',
    'Cancelled':   'secondary',
    'Pending':     'warning',
    'Approved':    'info',
    'Fulfilled':   'success',
    'Rejected':    'danger',
    'Critical':    'danger',
  };
  const cls = map[status] || 'secondary';
  return `<span class="badge badge-${cls}">${status}</span>`;
}

/* ── Format date ──────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

/* ── Set active nav link ─────────────────────────────────────── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}
document.addEventListener('DOMContentLoaded', setActiveNav);
