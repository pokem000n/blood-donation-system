let allRecipients = [];

const avatarColors = [
  ['rgba(78,156,244,0.15)','#4e9cf4'],
  ['rgba(155,114,245,0.15)','#9b72f5'],
  ['rgba(46,201,122,0.15)','#2ec97a'],
  ['rgba(244,169,78,0.15)','#f4a94e'],
  ['rgba(230,57,70,0.15)','#ff8088'],
];

async function loadRecipients() {
  try {
    allRecipients = await apiFetch('/recipients');
    renderTable(allRecipients);
  } catch (err) {
    showToast('Failed to load recipients: ' + err.message, 'error');
  }
}

async function loadBloodGroups() {
  try {
    const bgs = await apiFetch('/blood-groups');
    const sel = document.getElementById('rec-bg-select');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select blood group</option>' +
      bgs.map(b => `<option value="${b.blood_group_id}">${b.blood_group}</option>`).join('');
  } catch (e) { /* silent */ }
}

function renderTable(list) {
  const tbody = document.getElementById('recipients-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🏥</div><p>No recipients found.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((r, i) => {
    const [bg, tc] = avatarColors[i % avatarColors.length];
    return `
    <tr>
      <td style="color:var(--text3);font-size:12px;">${i + 1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          ${avatar(r.name, bg, tc)}
          <strong>${r.name}</strong>
        </div>
      </td>
      <td>${r.gender}</td>
      <td><strong>${r.age}</strong> yrs</td>
      <td><code style="background:var(--bg3);padding:2px 8px;border-radius:5px;font-size:12px;color:var(--text2);">${r.phone}</code></td>
      <td>${r.blood_group ? `<span class="badge badge-blood">${r.blood_group}</span>` : '<span style="color:var(--text3);font-size:12px;">—</span>'}</td>
      <td>${r.address || '<span style="color:var(--text3)">—</span>'}</td>
    </tr>`;
  }).join('');
}

function filterTable() {
  const q = document.getElementById('search-input').value.toLowerCase();
  renderTable(allRecipients.filter(r =>
    r.name.toLowerCase().includes(q) ||
    (r.phone || '').toLowerCase().includes(q)
  ));
}

async function addRecipient(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    name:           form.name.value,
    gender:         form.gender.value,
    age:            parseInt(form.age.value),
    phone:          form.phone.value,
    address:        form.address.value,
    blood_group_id: form.blood_group_id.value || null
  };
  try {
    await apiFetch('/recipients', { method: 'POST', body: JSON.stringify(body) });
    showToast('Recipient added!', 'success');
    closeModal('modal-add-recipient');
    loadRecipients();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

loadRecipients();
loadBloodGroups();
