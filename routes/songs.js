import express from "express";
import pgClient from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * SONGS API
 * Base: /api/songs
 */

// GET /api/songs (public)
router.get("/", async (req, res) => {
  try {
    const result = await pgClient.query("SELECT * FROM songs ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/songs/:id (public)
router.get("/:id", async (req, res) => {
  try {
    const result = await pgClient.query("SELECT * FROM songs WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});




// POST /api/songs (admin only)
router.post("/", adminAuth, upload.single("cover"), async (req, res) => {
  const { title, artist, genre } = req.body;


  if (!title || !artist) {
    return res.status(400).json({ message: "title and artist are required" });
  }


const cover_url = req.file ? `/uploads/${req.file.filename}` : null;


  try {
    const result = await pgClient.query(
      `INSERT INTO songs (title, artist, genre, cover_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, artist, genre || null, cover_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/songs/:id (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  const { title, artist, genre, cover_url } = req.body;

  if (!title || !artist) {
    return res.status(400).json({ message: "title and artist are required" });
  }

  try {
    const result = await pgClient.query(
      `UPDATE songs
       SET title = $1,
           artist = $2,
           genre = $3,
           cover_url = COALESCE($4, cover_url)
       WHERE id = $5
       RETURNING *`,
      [title, artist, genre || null, newCover, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Song not found" });
    }


    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// DELETE /api/songs/:id (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const result = await pgClient.query(
      "DELETE FROM songs WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json({ message: "Song deleted", deletedSong: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
