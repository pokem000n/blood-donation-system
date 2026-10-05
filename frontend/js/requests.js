let allRequests = [];

const STATUS_OPTIONS = ['Pending', 'Approved', 'Fulfilled', 'Rejected', 'Cancelled'];

async function loadRequests() {
  try {
    allRequests = await apiFetch('/requests');
    renderTable(allRequests);
  } catch (err) {
    showToast('Failed to load requests: ' + err.message, 'error');
  }
}

function renderTable(list) {
  const tbody = document.getElementById('requests-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon" style="font-size:40px">📋</div><p>No blood requests found.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((r, i) => `
    <tr>
      <td class="row-num">${i + 1}</td>
      <td>
        <strong>${r.recipient_name}</strong>
        <small>${r.recipient_phone}</small>
      </td>
      <td><small>${r.hospital_name}</small></td>
      <td><span class="badge badge-blood">${r.blood_group}</span></td>
      <td><strong>${r.quantity}</strong> <small>ml</small></td>
      <td>${fmtDate(r.request_date)}</td>
      <td>${statusBadge(r.status)}</td>
      <td>
        ${r.status === 'Pending' ? `
          <button class="btn btn-sm btn-success" onclick="updateStatus(${r.request_id}, 'Approved')">Approve</button>
          <button class="btn btn-sm btn-danger"  onclick="updateStatus(${r.request_id}, 'Rejected')" style="margin-left:4px;">Reject</button>
        ` : `<span style="color:var(--text3);font-size:12px;">—</span>`}
      </td>
    </tr>`).join('');
}

function filterTable() {
  const statusFilter = document.getElementById('filter-status').value;
  renderTable(statusFilter ? allRequests.filter(r => r.status === statusFilter) : allRequests);
}

async function updateStatus(id, status) {
  try {
    await apiFetch(`/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    showToast(`Request marked as ${status}`, 'success');
    loadRequests();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function loadDropdowns() {
  try {
    const [recipients, hospitals, groups] = await Promise.all([
      apiFetch('/recipients'),
      apiFetch('/hospitals'),
      apiFetch('/blood-groups')
    ]);

    document.getElementById('rec-select').innerHTML =
      `<option value="">Select recipient...</option>` +
      recipients.map(r => `<option value="${r.recipient_id}">${r.name}</option>`).join('');

    document.getElementById('hosp-select').innerHTML =
      `<option value="">Select hospital...</option>` +
      hospitals.map(h => `<option value="${h.hospital_id}">${h.name}</option>`).join('');

    document.getElementById('bg-select').innerHTML =
      `<option value="">Select blood group...</option>` +
      groups.map(g => `<option value="${g.blood_group_id}">${g.blood_group}</option>`).join('');

    document.getElementById('status-select').innerHTML =
      `<option value="">Select status...</option>` +
      STATUS_OPTIONS.map(s => `<option value="${s}">${s}</option>`).join('');

  } catch (err) {
    showToast('Failed to load dropdowns: ' + err.message, 'error');
  }
}

async function addRequest(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    recipient_id:   form.recipient_id.value,
    hospital_id:    form.hospital_id.value,
    blood_group_id: form.blood_group_id.value,
    status:         form.status.value,
    request_date:   form.request_date.value,
    quantity:       parseInt(form.quantity.value)
  };
  try {
    await apiFetch('/requests', { method: 'POST', body: JSON.stringify(body) });
    showToast('Blood request submitted!', 'success');
    closeModal('modal-add-request');
    loadRequests();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

loadRequests();
loadDropdowns();
