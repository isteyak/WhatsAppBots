const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = (
    await db.query("SELECT * FROM users WHERE username = $1", [username])
  ).rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

module.exports = loginRouter;
