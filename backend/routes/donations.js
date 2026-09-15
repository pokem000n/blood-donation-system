const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/donations
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT dn.donation_id, dn.donation_date, dn.quantity,
             d.name  AS donor_name, d.phone AS donor_phone,
             bg.blood_group,
             dc.certificate_no, dc.issue_date AS cert_issue_date
      FROM Donation dn
      JOIN Donor       d  ON dn.donor_id        = d.donor_id
      JOIN Blood_Group bg ON dn.blood_group_id  = bg.blood_group_id
      LEFT JOIN Donation_Certificate dc ON dn.donation_id = dc.donation_id
      ORDER BY dn.donation_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/donations
router.post('/', async (req, res) => {
  const { donor_id, blood_group_id, donation_date, quantity } = req.body;
  if (!donor_id || !blood_group_id || !donation_date || !quantity) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO Donation (donor_id, blood_group_id, donation_date, quantity)
       VALUES (?, ?, ?, ?)`,
      [donor_id, blood_group_id, donation_date, quantity]
    );
    res.status(201).json({ message: 'Donation recorded.', donation_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
