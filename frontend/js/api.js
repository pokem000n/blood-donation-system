const API_BASE = '/api';

/* ── Theme ──────────────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('hemotrack-theme') || 'dark';
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
})();

function toggleTheme() {
  const isLight = document.documentElement.hasAttribute('data-theme');
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('hemotrack-theme', 'dark');
    document.getElementById('theme-btn').textContent = '☀️';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('hemotrack-theme', 'light');
    document.getElementById('theme-btn').textContent = '🌙';
  }
}

/* ── Sidebar Injection ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectSidebar();
  setActiveNav();
  updateThemeBtn();
  const d = document.getElementById('current-date');
  if (d) d.textContent = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
});

function injectSidebar() {
  const root = document.getElementById('sidebar-root');
  if (!root) return;
  root.innerHTML = `
  <aside class="sidebar">
    <a href="index.html" class="sidebar-logo" style="display:flex;align-items:center;gap:12px;text-decoration:none;">
      <div class="logo-mark">
        <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="44" height="44" rx="12" fill="url(#lg)"/>
          <path d="M22 8C22 8 12 19 12 25a10 10 0 0020 0C32 19 22 8 22 8z" fill="white" opacity="0.95"/>
          <path d="M18 26q0 4 4 4" stroke="rgba(230,57,70,0.7)" stroke-width="1.5" stroke-linecap="round"/>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="44" y2="44">
              <stop offset="0%" stop-color="#e63946"/>
              <stop offset="100%" stop-color="#c1121f"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="logo-text">
        <h2>Hemo<span>Track</span></h2>
        <small>Donation Management</small>
      </div>
    </a>
    <nav>
      <div class="nav-section">Overview</div>
      <a href="index.html"        class="nav-link"><span class="nav-icon">🏠</span> Dashboard</a>
      <div class="nav-section">Manage</div>
      <a href="donors.html"       class="nav-link"><span class="nav-icon">👤</span> Donors</a>
      <a href="recipients.html"   class="nav-link"><span class="nav-icon">🏥</span> Recipients</a>
      <a href="donations.html"    class="nav-link"><span class="nav-icon">💉</span> Donations</a>
      <a href="inventory.html"    class="nav-link"><span class="nav-icon">🩸</span> Blood Inventory</a>
      <div class="nav-section">Requests</div>
      <a href="requests.html"     class="nav-link"><span class="nav-icon">📋</span> Blood Requests</a>
      <a href="emergency.html"    class="nav-link"><span class="nav-icon">🚨</span> Emergency</a>
      <a href="appointments.html" class="nav-link"><span class="nav-icon">📅</span> Appointments</a>
    </nav>
    <div class="sidebar-footer">HemoTrack v2.0 · DBMS Lab 2026</div>
  </aside>`;
}

function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  btn.textContent = document.documentElement.hasAttribute('data-theme') ? '🌙' : '☀️';
}

/* ── Fetch ──────────────────────────────────────────────────── */
async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/* ── Toast ──────────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3200);
}

/* ── Modal ──────────────────────────────────────────────────── */
function openModal(id)  { document.getElementById(id).classList.add('show'); }
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
  const f = document.querySelector(`#${id} form`);
  if (f) f.reset();
}

/* ── Helpers ────────────────────────────────────────────────── */
function statusBadge(s) {
  const map = {
    'Available':   ['success',   '●'], 'Unavailable': ['secondary','●'],
    'Scheduled':   ['info',      '◷'], 'Completed':   ['success',  '✓'],
    'Cancelled':   ['secondary', '✕'], 'Pending':     ['warning',  '◉'],
    'Approved':    ['info',      '✓'], 'Fulfilled':   ['success',  '✓'],
    'Rejected':    ['danger',    '✕'], 'Critical':    ['danger',   '⚡'],
  };
  const [cls, icon] = map[s] || ['secondary','●'];
  return `<span class="badge badge-${cls}">${icon} ${s}</span>`;
}

function fmtDate(d) {
  if (!d) return `<span style="color:var(--text3)">—</span>`;
  return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function avatar(name, bg='var(--danger-bg)', tc='var(--red)') {
  const i = name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  return `<div class="avatar" style="background:${bg};color:${tc}">${i}</div>`;
}
