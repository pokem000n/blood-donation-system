function stockLevel(qty) {
  if (qty >= 2000) return 'ok';
  if (qty >= 1000) return 'low';
  return 'critical';
}

function stockBadge(qty) {
  const lvl = stockLevel(qty);
  const map = { ok: 'success', low: 'warning', critical: 'danger' };
  const labels = { ok: 'OK', low: 'Low', critical: 'Critical' };
  return `<span class="badge badge-${map[lvl]}">${labels[lvl]}</span>`;
}

async function loadInventory() {
  try {
    const data = await apiFetch('/inventory');

    // Cards
    const grid = document.getElementById('inventory-grid');
    if (!data.length) {
      grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🩸</div><p>No inventory data.</p></div>`;
    } else {
      grid.innerHTML = data.map(item => `
        <div class="inv-card ${stockLevel(item.quantity)}">
          <div class="blood-type">${item.blood_group}</div>
          <div class="inv-qty">${item.quantity.toLocaleString()} ml</div>
          <div class="inv-label">Available Stock</div>
          <div class="inv-hospital">🏥 ${item.hospital_name}</div>
        </div>`).join('');
    }

    // Table
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = data.map((item, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><span class="badge badge-blood">${item.blood_group}</span></td>
        <td>${item.hospital_name}</td>
        <td style="font-size:12px;color:#7f8c8d;">${item.hospital_location}</td>
        <td><strong>${item.quantity.toLocaleString()}</strong></td>
        <td style="font-size:12px;">${new Date(item.last_updated).toLocaleString('en-GB')}</td>
        <td>${stockBadge(item.quantity)}</td>
      </tr>`).join('');

  } catch (err) {
    showToast('Failed to load inventory: ' + err.message, 'error');
  }
}

loadInventory();
