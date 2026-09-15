async function loadDonations() {
  try {
    const data = await apiFetch('/donations');
    const tbody = document.getElementById('donations-tbody');
    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">💉</div><p>No donations recorded.</p></div></td></tr>`;
      return;
    }
    tbody.innerHTML = data.map((d, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${d.donor_name}</strong><br><small style="color:#7f8c8d;">${d.donor_phone}</small></td>
        <td><span class="badge badge-blood">${d.blood_group}</span></td>
        <td>${fmtDate(d.donation_date)}</td>
        <td>${d.quantity}</td>
        <td>${d.certificate_no
          ? `<span class="badge badge-success">🎖 ${d.certificate_no}</span>`
          : `<span class="badge badge-secondary">—</span>`
        }</td>
      </tr>`).join('');
  } catch (err) {
    showToast('Failed to load donations: ' + err.message, 'error');
  }
}

async function loadDropdowns() {
  const [donors, groups] = await Promise.all([
    apiFetch('/donors'),
    apiFetch('/blood-groups')
  ]);
  document.getElementById('donor-select').innerHTML =
    `<option value="">Select donor...</option>` +
    donors.map(d => `<option value="${d.donor_id}">${d.name} (${d.phone})</option>`).join('');
  document.getElementById('bg-select').innerHTML =
    `<option value="">Select blood group...</option>` +
    groups.map(g => `<option value="${g.blood_group_id}">${g.blood_group}</option>`).join('');
}

async function addDonation(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    donor_id:       form.donor_id.value,
    blood_group_id: form.blood_group_id.value,
    donation_date:  form.donation_date.value,
    quantity:       parseInt(form.quantity.value)
  };
  try {
    await apiFetch('/donations', { method: 'POST', body: JSON.stringify(body) });
    showToast('Donation recorded!', 'success');
    closeModal('modal-add-donation');
    loadDonations();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

loadDonations();
loadDropdowns();
