const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const registerRouter = express.Router();

// Register a new user
registerRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = (
    await db.query("SELECT * FROM users WHERE username = $1", [username])
  ).rows[0];
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save the new user in the database
  try {
    const result = await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    const newUser = result.rows[0];

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = registerRouter;
