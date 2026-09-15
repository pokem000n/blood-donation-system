let allAppointments = [];

async function loadAppointments() {
  try {
    allAppointments = await apiFetch('/appointments');
    renderTable(allAppointments);
  } catch (err) {
    showToast('Failed to load appointments: ' + err.message, 'error');
  }
}

function renderTable(list) {
  const tbody = document.getElementById('appt-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📅</div><p>No appointments found.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((a, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${a.donor_name}</strong><br><small style="color:#7f8c8d;">${a.donor_phone}</small></td>
      <td>${a.center_name}</td>
      <td style="font-size:12px;color:#7f8c8d;">${a.center_location}</td>
      <td>${fmtDate(a.appointment_date)}</td>
      <td>${statusBadge(a.status)}</td>
      <td>
        ${a.status === 'Scheduled' ? `
          <button class="btn btn-sm btn-success" onclick="updateStatus(${a.appointment_id}, 'Completed')" style="margin-right:4px;">✓ Complete</button>
          <button class="btn btn-sm btn-outline"  onclick="updateStatus(${a.appointment_id}, 'Cancelled')">✕ Cancel</button>
        ` : `<span style="color:#bdc3c7;font-size:12px;">—</span>`}
      </td>
    </tr>`).join('');
}

function filterTable() {
  const v = document.getElementById('filter-status').value;
  renderTable(v ? allAppointments.filter(a => a.status === v) : allAppointments);
}

async function updateStatus(id, status) {
  try {
    await apiFetch(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    showToast(`Appointment marked as ${status}.`, 'success');
    loadAppointments();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function loadDropdowns() {
  const [donors, centers] = await Promise.all([
    apiFetch('/donors'),
    apiFetch('/centers')
  ]);
  document.getElementById('a-donor-select').innerHTML =
    `<option value="">Select donor...</option>` +
    donors.map(d => `<option value="${d.donor_id}">${d.name}</option>`).join('');
  document.getElementById('a-center-select').innerHTML =
    `<option value="">Select center...</option>` +
    centers.map(c => `<option value="${c.center_id}">${c.name} — ${c.location}</option>`).join('');
}

async function addAppointment(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    donor_id:         form.donor_id.value,
    center_id:        form.center_id.value,
    appointment_date: form.appointment_date.value,
    status:           form.status.value
  };
  try {
    await apiFetch('/appointments', { method: 'POST', body: JSON.stringify(body) });
    showToast('Appointment scheduled!', 'success');
    closeModal('modal-add-appt');
    loadAppointments();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

loadAppointments();
loadDropdowns();
