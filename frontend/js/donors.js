let allDonors = [];

async function loadDonors() {
  try {
    allDonors = await apiFetch('/donors');
    renderTable(allDonors);
  } catch (err) {
    showToast('Failed to load donors: ' + err.message, 'error');
  }
}

const colors = [
  ['rgba(230,57,70,0.15)','#ff8088'],
  ['rgba(78,156,244,0.15)','#4e9cf4'],
  ['rgba(46,201,122,0.15)','#2ec97a'],
  ['rgba(155,114,245,0.15)','#9b72f5'],
  ['rgba(244,169,78,0.15)','#f4a94e'],
];

function renderTable(donors) {
  const tbody = document.getElementById('donors-tbody');
  if (!donors.length) {
    tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><div class="empty-icon">👤</div><p>No donors found.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = donors.map((d, i) => {
    const [bg, tc] = colors[i % colors.length];
    return `
    <tr>
      <td>${i + 1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          ${avatar(d.name, bg, tc)}
          <div>
            <strong>${d.name}</strong><br>
            <small>${d.email || 'No email'}</small>
          </div>
        </div>
      </td>
      <td>${d.gender}</td>
      <td>${fmtDate(d.dob)}</td>
      <td><code style="background:var(--bg3);padding:2px 8px;border-radius:5px;font-size:12px;">${d.phone}</code></td>
      <td>${d.blood_group ? `<span class="badge badge-blood">${d.blood_group}</span>` : '<span style="color:var(--text3)">—</span>'}</td>
      <td style="text-align:center;"><strong style="color:var(--text)">${d.total_donations}</strong></td>
      <td>${fmtDate(d.last_donation_date)}</td>
      <td>${statusBadge(d.availability)}</td>
      <td>
        <button class="btn btn-sm ${d.availability === 'Available' ? 'btn-outline' : 'btn-success'}"
          onclick="toggleAvailability(${d.donor_id}, '${d.availability}')">
          ${d.availability === 'Available' ? 'Set Unavailable' : 'Set Available'}
        </button>
      </td>
    </tr>`;
  }).join('');
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
    name: form.name.value, dob: form.dob.value,
    gender: form.gender.value, phone: form.phone.value,
    email: form.email.value, address: form.address.value,
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
    await apiFetch(`/donors/${id}/availability`, { method: 'PUT', body: JSON.stringify({ availability: next }) });
    showToast(`Marked as ${next}`, 'success');
    loadDonors();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

loadDonors();
