let allRecipients = [];

async function loadRecipients() {
  try {
    allRecipients = await apiFetch('/recipients');
    renderTable(allRecipients);
  } catch (err) {
    showToast('Failed to load recipients: ' + err.message, 'error');
  }
}

function renderTable(list) {
  const tbody = document.getElementById('recipients-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🏥</div><p>No recipients found.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${r.name}</strong></td>
      <td>${r.gender}</td>
      <td>${r.age}</td>
      <td>${r.phone}</td>
      <td>${r.address || '—'}</td>
      <td style="text-align:center;">${r.total_requests}</td>
    </tr>`).join('');
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
    name:    form.name.value,
    gender:  form.gender.value,
    age:     parseInt(form.age.value),
    phone:   form.phone.value,
    address: form.address.value
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
