const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/recipients — includes blood_group
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.recipient_id, r.name, r.gender, r.age, r.phone, r.address,
             bg.blood_group,
             COUNT(br.request_id) AS total_requests
      FROM Recipient r
      LEFT JOIN Blood_Group   bg ON r.blood_group_id  = bg.blood_group_id
      LEFT JOIN Blood_Request br ON r.recipient_id    = br.recipient_id
      GROUP BY r.recipient_id, r.name, r.gender, r.age, r.phone, r.address, bg.blood_group
      ORDER BY r.recipient_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recipients — now accepts blood_group_id
router.post('/', async (req, res) => {
  const { name, gender, age, phone, address, blood_group_id } = req.body;
  if (!name || !gender || !age || !phone) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO Recipient (name, gender, age, phone, address, blood_group_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, gender, age, phone, address || null, blood_group_id || null]
    );
    res.status(201).json({ message: 'Recipient added.', recipient_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
