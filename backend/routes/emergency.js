const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/emergency
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT er.emergency_id, er.request_date, er.status,
             r.name  AS recipient_name, r.age, r.gender,
             bg.blood_group,
             h.name  AS hospital_name, h.phone AS hospital_phone
      FROM Emergency_Request er
      JOIN Recipient   r  ON er.recipient_id   = r.recipient_id
      JOIN Blood_Group bg ON er.blood_group_id = bg.blood_group_id
      JOIN Hospital    h  ON er.hospital_id    = h.hospital_id
      ORDER BY
        CASE er.status WHEN 'Critical' THEN 1 WHEN 'Pending' THEN 2 ELSE 3 END,
        er.request_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/emergency
router.post('/', async (req, res) => {
  const { recipient_id, blood_group_id, hospital_id, request_date, status } = req.body;
  if (!recipient_id || !blood_group_id || !hospital_id || !request_date || !status) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO Emergency_Request (recipient_id, blood_group_id, hospital_id, request_date, status)
       VALUES (?, ?, ?, ?, ?)`,
      [recipient_id, blood_group_id, hospital_id, request_date, status]
    );
    res.status(201).json({ message: 'Emergency request filed.', emergency_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/emergency/:id/status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query(`UPDATE Emergency_Request SET status = ? WHERE emergency_id = ?`,
      [status, req.params.id]);
    res.json({ message: 'Emergency status updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
