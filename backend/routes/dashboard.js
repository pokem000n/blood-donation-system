const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const [[donorRow]]       = await db.query(`SELECT COUNT(*) AS total FROM Donor`);
    const [[recipRow]]       = await db.query(`SELECT COUNT(*) AS total FROM Recipient`);
    const [[availRow]]       = await db.query(`SELECT COUNT(*) AS total FROM Donor WHERE availability = 'Available'`);
    const [[pendingRow]]     = await db.query(`SELECT COUNT(*) AS total FROM Blood_Request br JOIN Request_Status rs ON br.status_id = rs.status_id WHERE rs.status_name = 'Pending'`);
    const [[criticalRow]]    = await db.query(`SELECT COUNT(*) AS total FROM Emergency_Request WHERE status = 'Critical'`);
    const [[inventoryRow]]   = await db.query(`SELECT IFNULL(SUM(quantity),0) AS total FROM Blood_Inventory`);
    const [[donationRow]]    = await db.query(`SELECT COUNT(*) AS total FROM Donation`);
    const [[appointmentRow]] = await db.query(`SELECT COUNT(*) AS total FROM Appointment WHERE status = 'Scheduled'`);

    // Recent emergency requests
    const [recentEmergency] = await db.query(`
      SELECT er.emergency_id, er.request_date, er.status,
             r.name AS recipient_name, bg.blood_group, h.name AS hospital_name
      FROM Emergency_Request er
      JOIN Recipient   r  ON er.recipient_id   = r.recipient_id
      JOIN Blood_Group bg ON er.blood_group_id = bg.blood_group_id
      JOIN Hospital    h  ON er.hospital_id    = h.hospital_id
      ORDER BY er.request_date DESC
      LIMIT 5
    `);

    // Inventory summary per blood group
    const [inventorySummary] = await db.query(`
      SELECT bg.blood_group, IFNULL(SUM(bi.quantity), 0) AS total_ml
      FROM Blood_Group bg
      LEFT JOIN Blood_Inventory bi ON bg.blood_group_id = bi.blood_group_id
      GROUP BY bg.blood_group_id, bg.blood_group
      ORDER BY bg.blood_group
    `);

    res.json({
      stats: {
        totalDonors:        donorRow.total,
        totalRecipients:    recipRow.total,
        availableDonors:    availRow.total,
        pendingRequests:    pendingRow.total,
        criticalEmergency:  criticalRow.total,
        totalInventoryMl:   inventoryRow.total,
        totalDonations:     donationRow.total,
        scheduledAppointments: appointmentRow.total
      },
      recentEmergency,
      inventorySummary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
