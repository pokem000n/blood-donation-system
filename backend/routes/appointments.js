const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/appointments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.appointment_id, a.appointment_date, a.status,
             d.name  AS donor_name, d.phone AS donor_phone,
             dc.name AS center_name, dc.location AS center_location, dc.contact_no
      FROM Appointment a
      JOIN Donor           d  ON a.donor_id  = d.donor_id
      JOIN Donation_Center dc ON a.center_id = dc.center_id
      ORDER BY a.appointment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appointments
router.post('/', async (req, res) => {
  const { donor_id, center_id, appointment_date, status } = req.body;
  if (!donor_id || !center_id || !appointment_date || !status) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO Appointment (donor_id, center_id, appointment_date, status)
       VALUES (?, ?, ?, ?)`,
      [donor_id, center_id, appointment_date, status]
    );
    res.status(201).json({ message: 'Appointment created.', appointment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/appointments/:id/status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query(`UPDATE Appointment SET status = ? WHERE appointment_id = ?`,
      [status, req.params.id]);
    res.json({ message: 'Appointment status updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
