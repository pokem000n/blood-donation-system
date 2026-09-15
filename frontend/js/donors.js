let allDonors = [];

async function loadDonors() {
  try {
    allDonors = await apiFetch('/donors');
    renderTable(allDonors);
  } catch (err) {
    showToast('Failed to load donors: ' + err.message, 'error');
  }
}

function renderTable(donors) {
  const tbody = document.getElementById('donors-tbody');
  if (!donors.length) {
    tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><div class="empty-icon">👤</div><p>No donors found.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = donors.map((d, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${d.name}</strong><br><small style="color:#7f8c8d;">${d.email || ''}</small></td>
      <td>${d.gender}</td>
      <td>${fmtDate(d.dob)}</td>
      <td>${d.phone}</td>
      <td>${d.blood_group ? `<span class="badge badge-blood">${d.blood_group}</span>` : '—'}</td>
      <td style="text-align:center;">${d.total_donations}</td>
      <td>${fmtDate(d.last_donation_date)}</td>
      <td>${statusBadge(d.availability)}</td>
      <td>
        <button class="btn btn-sm ${d.availability === 'Available' ? 'btn-outline' : 'btn-success'}"
          onclick="toggleAvailability(${d.donor_id}, '${d.availability}')">
          ${d.availability === 'Available' ? 'Mark Unavailable' : 'Mark Available'}
        </button>
      </td>
    </tr>`).join('');
}

function filterTable() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const filtered = allDonors.filter(d =>
    d.name.toLowerCase().includes(q) ||
    (d.phone || '').toLowerCase().includes(q) ||
    (d.email || '').toLowerCase().includes(q) ||
    (d.blood_group || '').toLowerCase().includes(q)
  );
  renderTable(filtered);
}

async function addDonor(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    name:         form.name.value,
    dob:          form.dob.value,
    gender:       form.gender.value,
    phone:        form.phone.value,
    email:        form.email.value,
    address:      form.address.value,
    availability: form.availability.value
  };
  try {
    await apiFetch('/donors', { method: 'POST', body: JSON.stringify(body) });
    showToast('Donor added successfully!', 'success');
    closeModal('modal-add-donor');
    loadDonors();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function toggleAvailability(id, current) {
  const next = current === 'Available' ? 'Unavailable' : 'Available';
  try {
    await apiFetch(`/donors/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability: next })
    });
    showToast(`Donor marked as ${next}.`, 'success');
    loadDonors();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

loadDonors();
