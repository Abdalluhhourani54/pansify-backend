import express from "express";
import pgClient from "../db.js";

const router = express.Router();

// GET /api/songs/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const result = await pgClient.query(
      "SELECT * FROM reviews WHERE song_id = $1 ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.log("GET REVIEWS ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/songs/:id/reviews
router.post("/:id/reviews", async (req, res) => {
  try {
    const { reviewer_name, reviewer_email, rating, comment } = req.body;

    if (!reviewer_name || !reviewer_email || rating === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pgClient.query(
      `INSERT INTO reviews (song_id, reviewer_name, reviewer_email, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.params.id, reviewer_name, reviewer_email, rating, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("POST REVIEW ERROR:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

export default router;
