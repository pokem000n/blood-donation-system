const API_BASE = '/api';

/* ── Theme ──────────────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('hemotrack-theme') || 'dark';
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
})();

function toggleTheme() {
  const isLight = document.documentElement.hasAttribute('data-theme');
  document.documentElement.toggleAttribute('data-theme', !isLight);
  if (!isLight) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('hemotrack-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('hemotrack-theme', 'dark');
  }
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  const isLight = document.documentElement.hasAttribute('data-theme');
  btn.innerHTML = isLight
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
}

/* ── Lucide Icon helper ──────────────────────────────────────── */
function icon(name, size = 15) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name}">${lucidePaths[name] || ''}</svg>`;
}

const lucidePaths = {
  'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  'users':           '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'user-check':      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
  'building-2':      '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  'droplets':        '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  'clipboard-list':  '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  'alert-triangle':  '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'flask-conical':   '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  'calendar-days':   '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  'home':            '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'syringe':         '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
  'heart-pulse':     '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 4.5 1.5-3h6.28"/>',
  'stethoscope':     '<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 4.97 3.06 9.19 7.56 10.91"/><path d="M11 2h2"/><path d="M13 4a2 2 0 0 1 2 2v5h5a2 2 0 0 1 2 2v2c0 4.97-3.06 9.19-7.56 10.91"/><path d="M11 22a10.3 10.3 0 0 0 2 0"/><circle cx="11" cy="5" r="1"/><circle cx="13" cy="5" r="1"/>',
  'activity':        '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'shield-alert':    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  'clock':           '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'sun':             '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  'moon':            '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  'arrow-right':     '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'chevron-right':   '<path d="m9 18 6-6-6-6"/>',
  'plus':            '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'search':          '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'filter':          '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'x':               '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'check':           '<path d="M20 6 9 17l-5-5"/>',
  'edit':            '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  'trash':           '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  'refresh-cw':      '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  'log-out':         '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
};

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

  const navItems = [
    { href: 'index.html',        iconKey: 'layout-dashboard', label: 'Dashboard',      section: 'Overview' },
    { href: 'donors.html',       iconKey: 'users',            label: 'Donors',         section: 'Manage' },
    { href: 'recipients.html',   iconKey: 'building-2',       label: 'Recipients',     section: null },
    { href: 'donations.html',    iconKey: 'droplets',         label: 'Donations',      section: null },
    { href: 'inventory.html',    iconKey: 'flask-conical',    label: 'Blood Inventory',section: null },
    { href: 'requests.html',     iconKey: 'clipboard-list',   label: 'Blood Requests', section: 'Requests' },
    { href: 'emergency.html',    iconKey: 'alert-triangle',   label: 'Emergency',      section: null },
    { href: 'appointments.html', iconKey: 'calendar-days',    label: 'Appointments',   section: null },
  ];

  const navHTML = navItems.map(item => `
    ${item.section ? `<div class="nav-section">${item.section}</div>` : ''}
    <a href="${item.href}" class="nav-link">
      <span class="nav-icon">${icon(item.iconKey, 16)}</span>
      ${item.label}
    </a>`).join('');

  root.innerHTML = `
  <aside class="sidebar">
    <a href="index.html" class="sidebar-logo" style="display:flex;align-items:center;gap:11px;text-decoration:none;">
      <div class="logo-mark">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="11" fill="url(#lg2)"/>
          <path d="M20 7C20 7 11 17 11 23a9 9 0 0018 0C29 17 20 7 20 7z" fill="white" opacity="0.96"/>
          <path d="M16.5 24q0 3.5 3.5 3.5" stroke="rgba(220,40,55,0.65)" stroke-width="1.4" stroke-linecap="round"/>
          <defs>
            <linearGradient id="lg2" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stop-color="#e63946"/>
              <stop offset="100%" stop-color="#ad1220"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="logo-text">
        <h2>Hemo<span>Track</span></h2>
        <small>Donation Management</small>
      </div>
    </a>
    <nav>${navHTML}</nav>
    <div class="sidebar-footer">
      <span>HemoTrack v3.0</span>
      <span style="display:flex;align-items:center;gap:5px;font-size:10px;"><span class="dot"></span> Online</span>
    </div>
  </aside>`;
}

function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
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
  const toastIcon = {
    success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    error:   '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${toastIcon[type]}</svg> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(60px)'; toast.style.transition = 'all .3s'; setTimeout(() => toast.remove(), 300); }, 3200);
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
    'Available':   ['success',   'check'],
    'Unavailable': ['secondary', 'x'],
    'Scheduled':   ['info',      'clock'],
    'Completed':   ['success',   'check'],
    'Cancelled':   ['secondary', 'x'],
    'Pending':     ['warning',   'clock'],
    'Approved':    ['info',      'check'],
    'Fulfilled':   ['success',   'check'],
    'Rejected':    ['danger',    'x'],
    'Critical':    ['danger',    'shield-alert'],
  };
  const [cls, ico] = map[s] || ['secondary', 'activity'];
  return `<span class="badge badge-${cls}">${icon(ico, 10)} ${s}</span>`;
}

function fmtDate(d) {
  if (!d) return `<span style="color:var(--text3)">—</span>`;
  return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function avatar(name, bg = 'var(--danger-bg)', tc = 'var(--red)') {
  const i = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return `<div class="avatar" style="background:${bg};color:${tc}">${i}</div>`;
}
