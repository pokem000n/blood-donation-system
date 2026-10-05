const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/donors — join blood group from Donor.blood_group_id first, then fallback to latest donation
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.donor_id, d.name, d.dob, d.gender, d.phone, d.email,
             d.address, d.availability,
             COALESCE(bg_direct.blood_group, bg_don.blood_group) AS blood_group,
             MAX(dn.donation_date) AS last_donation_date,
             COUNT(dn.donation_id) AS total_donations
      FROM Donor d
      LEFT JOIN Blood_Group bg_direct ON d.blood_group_id    = bg_direct.blood_group_id
      LEFT JOIN Donation    dn        ON d.donor_id           = dn.donor_id
      LEFT JOIN Blood_Group bg_don    ON dn.blood_group_id    = bg_don.blood_group_id
      GROUP BY d.donor_id, d.name, d.dob, d.gender, d.phone,
               d.email, d.address, d.availability,
               bg_direct.blood_group, bg_don.blood_group
      ORDER BY d.donor_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/donors — now accepts blood_group_id, donated_bags, and hospital_id
router.post('/', async (req, res) => {
  const { name, dob, gender, phone, email, address, availability, blood_group_id, donated_bags, hospital_id } = req.body;
  if (!name || !dob || !gender || !phone || !availability) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert Donor
    const [result] = await conn.query(
      `INSERT INTO Donor (name, dob, gender, phone, email, address, availability, blood_group_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, dob, gender, phone, email || null, address || null, availability, blood_group_id || null]
    );
    const donor_id = result.insertId;

    // 2. If bags donated > 0, record donation and update stock
    if (donated_bags > 0 && blood_group_id && hospital_id) {
      const quantity_ml = donated_bags * 450;
      const today = new Date().toISOString().split('T')[0];

      // Insert Donation
      await conn.query(
        `INSERT INTO Donation (donor_id, blood_group_id, donation_date, quantity) VALUES (?, ?, ?, ?)`,
        [donor_id, blood_group_id, today, quantity_ml]
      );

      // Check Inventory
      const [inv] = await conn.query(
        `SELECT inventory_id FROM Blood_Inventory WHERE blood_group_id = ? AND blood_bank_id = ?`,
        [blood_group_id, hospital_id]
      );

      if (inv.length > 0) {
        // Update existing stock
        await conn.query(
          `UPDATE Blood_Inventory SET quantity = quantity + ?, last_updated = NOW() WHERE inventory_id = ?`,
          [quantity_ml, inv[0].inventory_id]
        );
      } else {
        // Insert new stock record
        await conn.query(
          `INSERT INTO Blood_Inventory (blood_group_id, blood_bank_id, quantity, last_updated) VALUES (?, ?, ?, NOW())`,
          [blood_group_id, hospital_id, quantity_ml]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ message: 'Donor added successfully.', donor_id });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
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
