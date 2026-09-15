const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/inventory
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT bi.inventory_id, bi.quantity, bi.last_updated,
             bg.blood_group,
             h.name AS hospital_name, h.location AS hospital_location
      FROM Blood_Inventory bi
      JOIN Blood_Group bg ON bi.blood_group_id = bg.blood_group_id
      JOIN Hospital    h  ON bi.blood_bank_id  = h.hospital_id
      ORDER BY h.name, bg.blood_group
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
