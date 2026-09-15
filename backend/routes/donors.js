const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/donors
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.donor_id, d.name, d.dob, d.gender, d.phone, d.email,
             d.address, d.availability,
             bg.blood_group,
             MAX(dn.donation_date) AS last_donation_date,
             COUNT(dn.donation_id) AS total_donations
      FROM Donor d
      LEFT JOIN Donation    dn ON d.donor_id        = dn.donor_id
      LEFT JOIN Blood_Group bg ON dn.blood_group_id = bg.blood_group_id
      GROUP BY d.donor_id, d.name, d.dob, d.gender, d.phone,
               d.email, d.address, d.availability, bg.blood_group
      ORDER BY d.donor_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/donors
router.post('/', async (req, res) => {
  const { name, dob, gender, phone, email, address, availability } = req.body;
  if (!name || !dob || !gender || !phone || !availability) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO Donor (name, dob, gender, phone, email, address, availability)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, dob, gender, phone, email || null, address || null, availability]
    );
    res.status(201).json({ message: 'Donor added.', donor_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/donors/:id/availability
router.put('/:id/availability', async (req, res) => {
  const { availability } = req.body;
  try {
    await db.query(`UPDATE Donor SET availability = ? WHERE donor_id = ?`,
      [availability, req.params.id]);
    res.json({ message: 'Availability updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
