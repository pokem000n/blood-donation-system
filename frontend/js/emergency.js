let allEmergencies = [];

async function loadEmergency() {
  try {
    allEmergencies = await apiFetch('/emergency');
    renderTable(allEmergencies);
  } catch (err) {
    showToast('Failed to load emergency requests: ' + err.message, 'error');
  }
}

function renderTable(list) {
  const tbody = document.getElementById('emergency-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">🚨</div><p>No emergency requests.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((e, i) => `
    <tr class="${e.status === 'Critical' ? 'critical-row' : ''}">
      <td>${i + 1}</td>
      <td><strong>${e.recipient_name}</strong><br><small>${e.gender}</small></td>
      <td>${e.age}</td>
      <td><span class="badge badge-blood">${e.blood_group}</span></td>
      <td style="font-size:12px;">${e.hospital_name}<br><small style="color:#7f8c8d;">${e.hospital_phone}</small></td>
      <td>${fmtDate(e.request_date)}</td>
      <td>${statusBadge(e.status)}</td>
      <td>
        ${e.status !== 'Fulfilled' ? `
          <button class="btn btn-sm btn-success" onclick="markFulfilled(${e.emergency_id})">✓ Fulfill</button>
        ` : `<span style="color:#bdc3c7;font-size:12px;">—</span>`}
      </td>
    </tr>`).join('');
}

async function markFulfilled(id) {
  try {
    await apiFetch(`/emergency/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'Fulfilled' })
    });
    showToast('Emergency request fulfilled!', 'success');
    loadEmergency();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function loadDropdowns() {
  const [recipients, groups, hospitals] = await Promise.all([
    apiFetch('/recipients'),
    apiFetch('/blood-groups'),
    apiFetch('/hospitals')
  ]);
  document.getElementById('e-rec-select').innerHTML =
    `<option value="">Select recipient...</option>` +
    recipients.map(r => `<option value="${r.recipient_id}">${r.name}</option>`).join('');
  document.getElementById('e-bg-select').innerHTML =
    `<option value="">Select blood group...</option>` +
    groups.map(g => `<option value="${g.blood_group_id}">${g.blood_group}</option>`).join('');
  document.getElementById('e-hosp-select').innerHTML =
    `<option value="">Select hospital...</option>` +
    hospitals.map(h => `<option value="${h.hospital_id}">${h.name}</option>`).join('');
}

async function addEmergency(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    recipient_id:   form.recipient_id.value,
    blood_group_id: form.blood_group_id.value,
    hospital_id:    form.hospital_id.value,
    request_date:   form.request_date.value,
    status:         form.status.value
  };
  try {
    await apiFetch('/emergency', { method: 'POST', body: JSON.stringify(body) });
    showToast('Emergency request filed!', 'success');
    closeModal('modal-add-emergency');
    loadEmergency();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

loadEmergency();
loadDropdowns();
