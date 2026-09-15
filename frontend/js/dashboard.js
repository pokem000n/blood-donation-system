document.getElementById('current-date').textContent =
  new Date().toLocaleDateString('en-GB', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

async function loadDashboard() {
  try {
    const data = await apiFetch('/dashboard/stats');
    const s = data.stats;

    document.getElementById('s-donors').textContent      = s.totalDonors;
    document.getElementById('s-available').textContent   = s.availableDonors;
    document.getElementById('s-recipients').textContent  = s.totalRecipients;
    document.getElementById('s-donations').textContent   = s.totalDonations;
    document.getElementById('s-pending').textContent     = s.pendingRequests;
    document.getElementById('s-critical').textContent    = s.criticalEmergency;
    document.getElementById('s-inventory').textContent   = s.totalInventoryMl.toLocaleString();
    document.getElementById('s-appointments').textContent = s.scheduledAppointments;

    // Inventory bar chart
    const inv     = data.inventorySummary;
    const maxQty  = Math.max(...inv.map(i => i.total_ml), 1);
    const chartEl = document.getElementById('inventory-chart');
    chartEl.innerHTML = inv.map(item => {
      const pct = Math.round((item.total_ml / maxQty) * 100);
      return `
        <div class="chart-row">
          <span class="label">${item.blood_group}</span>
          <div class="bar-bg">
            <div class="bar" style="width:${pct}%">${item.total_ml > 0 ? item.total_ml + ' ml' : ''}</div>
          </div>
          <span class="qty">${item.total_ml.toLocaleString()} ml</span>
        </div>`;
    }).join('');

    // Emergency table
    const tbody = document.getElementById('emergency-tbody');
    if (!data.recentEmergency.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#7f8c8d;padding:20px;">No emergency requests found.</td></tr>`;
      return;
    }
    tbody.innerHTML = data.recentEmergency.map(e => `
      <tr class="${e.status === 'Critical' ? 'critical-row' : ''}">
        <td>${e.recipient_name}</td>
        <td><span class="badge badge-blood">${e.blood_group}</span></td>
        <td style="font-size:12px;">${e.hospital_name}</td>
        <td>${statusBadge(e.status)}</td>
      </tr>`).join('');

  } catch (err) {
    showToast('Failed to load dashboard: ' + err.message, 'error');
  }
}

loadDashboard();
