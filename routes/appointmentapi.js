const express = require("express");
const authMiddleware = require("../middleware/authentication");
const db = require("../db");
const appoitnmetApiRouter = express.Router();

appoitnmetApiRouter.get("/", authMiddleware, async (req, res) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // fetch appointments using decoded.userId
    const result = await db.query(`
      SELECT a.id, p.name AS patient_name, a.date, a.time, a.status, a.payment_status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      ORDER BY a.date DESC, a.time DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
});

module.exports = appoitnmetApiRouter;
