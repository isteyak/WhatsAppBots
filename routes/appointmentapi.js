const express = require("express");
const authMiddleware = require("../middleware/Authentication");
const db = require("../db");
const appoitnmetApiRouter = express.Router();

appoitnmetApiRouter.get("/", authMiddleware, async (req, res) => {
  const result = await db.query(`
    SELECT a.id, p.name AS patient_name, a.date, a.time, a.status, a.payment_status
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    ORDER BY a.date DESC, a.time DESC
  `);

  res.json(result.rows);
});

module.exports = appoitnmetApiRouter;
