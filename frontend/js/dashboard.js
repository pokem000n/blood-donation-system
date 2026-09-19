/* Animated counter */
function animateCount(el, target, duration = 900) {
  const isLarge  = target > 999;
  const start    = 0;
  const startTs  = performance.now();
  const step = (ts) => {
    const progress = Math.min((ts - startTs) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const current  = Math.round(start + (target - start) * ease);
    el.textContent = isLarge ? current.toLocaleString() : current;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isLarge ? target.toLocaleString() : target;
  };
  requestAnimationFrame(step);
}

async function loadDashboard() {
  try {
    const data = await apiFetch('/dashboard/stats');
    const s    = data.stats;

    /* ── Animated stat counters ── */
    animateCount(document.getElementById('s-donors'),       s.totalDonors);
    animateCount(document.getElementById('s-available'),    s.availableDonors);
    animateCount(document.getElementById('s-recipients'),   s.totalRecipients);
    animateCount(document.getElementById('s-donations'),    s.totalDonations);
    animateCount(document.getElementById('s-pending'),      s.pendingRequests);
    animateCount(document.getElementById('s-critical'),     s.criticalEmergency);
    animateCount(document.getElementById('s-inventory'),    s.totalInventoryMl, 1200);
    animateCount(document.getElementById('s-appointments'), s.scheduledAppointments);

    /* ── Bar chart ── */
    const inv     = data.inventorySummary;
    const maxQty  = Math.max(...inv.map(i => i.total_ml), 1);
    const chartEl = document.getElementById('inventory-chart');
    chartEl.innerHTML = inv.length ? inv.map(item => {
      const pct = Math.round((item.total_ml / maxQty) * 100);
      return `
        <div class="chart-row">
          <span class="label">${item.blood_group}</span>
          <div class="bar-bg">
            <div class="bar" style="width:0%" data-target="${pct}">
              ${item.total_ml > 0 ? item.total_ml + ' ml' : ''}
            </div>
          </div>
          <span class="qty">${item.total_ml.toLocaleString()} ml</span>
        </div>`;
    }).join('') : '<p style="color:var(--text3);font-size:13px;text-align:center;padding:20px;">No inventory data</p>';

    /* animate bars after paint */
    requestAnimationFrame(() => {
      document.querySelectorAll('.bar[data-target]').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.target + '%'; }, 80);
      });
    });

    /* ── Emergency table ── */
    const tbody = document.getElementById('emergency-tbody');
    if (!data.recentEmergency.length) {
      tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">🚨</div><p>No emergency requests</p></div></td></tr>`;
      return;
    }
    tbody.innerHTML = data.recentEmergency.map(e => `
      <tr class="${e.status === 'Critical' ? 'critical-row' : ''}">
        <td><strong>${e.recipient_name}</strong></td>
        <td><span class="badge badge-blood">${e.blood_group}</span></td>
        <td><small>${e.hospital_name}</small></td>
        <td>${statusBadge(e.status)}</td>
      </tr>`).join('');

  } catch (err) {
    showToast('Failed to load dashboard: ' + err.message, 'error');
  }
}

loadDashboard();
