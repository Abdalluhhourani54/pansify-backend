import express from "express";
import db from "../db.js";

const router = express.Router();

// POST /api/auth/signup
// body: { full_name, email, password, role }
router.post("/signup", async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "full_name, email, password are required" });
    }

    const exists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const safeRole = role === "admin" ? "admin" : "user"; // keep it simple

    const result = await db.query(
      "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [full_name, email, password, safeRole]
    );

    // return user (you can also remove password from response if you want)
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.log("SIGNUP ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/auth/login
// body: { email, password }
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.log("LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
