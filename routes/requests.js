import express from "express";
import pgClient from "../db.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * SONG REQUESTS API
 * Base: /api/requests
 */

// GET /api/requests  OR  /api/requests?email=...
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      const result = await pgClient.query(
        "SELECT * FROM song_requests WHERE requester_email = $1 ORDER BY id DESC",
        [email]
      );
      return res.json(result.rows);
    }

    const result = await pgClient.query(
      "SELECT * FROM song_requests ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.log("GET REQUESTS ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/requests (user create request)
router.post("/", async (req, res) => {
  try {
    const { title, artist, genre, requester_email } = req.body;

    if (!title || !artist || !requester_email) {
      return res.status(400).json({
        message: "title, artist, and requester_email are required",
      });
    }

    const result = await pgClient.query(
      `INSERT INTO song_requests (title, artist, genre, requester_email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, artist, genre || null, requester_email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("CREATE REQUEST ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/requests/:id/approve (admin only)
router.put("/:id/approve", adminAuth, async (req, res) => {
  try {
    const result = await pgClient.query(
      `UPDATE song_requests
       SET status = 'Approved'
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request approved", request: result.rows[0] });
  } catch (err) {
    console.log("APPROVE ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/requests/:id/reject (admin only)
router.put("/:id/reject", adminAuth, async (req, res) => {
  try {
    const result = await pgClient.query(
      `UPDATE song_requests
       SET status = 'Rejected'
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request rejected", request: result.rows[0] });
  } catch (err) {
    console.log("REJECT ERROR:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
