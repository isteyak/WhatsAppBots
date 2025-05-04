const express = require("express");
const doctorRouter = express.Router();
const db = require("../db");

// GET all doctors
doctorRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM doctors");
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        doctors: result.rows,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "Failed to fetch doctors testing it adad",
    });
  }
});

// GET doctors by specialty
doctorRouter.get("/specialty/:specialty", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM doctors WHERE specialty = $1",
      [req.params.specialty]
    );
    res.json({
      status: "success",
      results: result.rows.length,
      data: {
        doctors: result.rows,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch doctors by specialty",
    });
  }
});

module.exports = doctorRouter;
