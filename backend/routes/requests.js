const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/requests
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT br.request_id, br.request_date, br.quantity,
             r.name  AS recipient_name, r.phone AS recipient_phone,
             h.name  AS hospital_name,
             bg.blood_group,
             rs.status_name AS status
      FROM Blood_Request br
      JOIN Recipient     r  ON br.recipient_id   = r.recipient_id
      JOIN Hospital      h  ON br.hospital_id    = h.hospital_id
      JOIN Blood_Group   bg ON br.blood_group_id = bg.blood_group_id
      JOIN Request_Status rs ON br.status_id     = rs.status_id
      ORDER BY br.request_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/requests
router.post('/', async (req, res) => {
  const { recipient_id, hospital_id, blood_group_id, status_id, request_date, quantity } = req.body;
  if (!recipient_id || !hospital_id || !blood_group_id || !status_id || !request_date || !quantity) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO Blood_Request (recipient_id, hospital_id, blood_group_id, status_id, request_date, quantity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [recipient_id, hospital_id, blood_group_id, status_id, request_date, quantity]
    );
    res.status(201).json({ message: 'Request created.', request_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/requests/:id/status
router.put('/:id/status', async (req, res) => {
  const { status_id } = req.body;
  try {
    await db.query(`UPDATE Blood_Request SET status_id = ? WHERE request_id = ?`,
      [status_id, req.params.id]);
    res.json({ message: 'Status updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests/statuses
router.get('/statuses', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM Request_Status`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
