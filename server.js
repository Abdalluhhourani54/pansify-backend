import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import pgClient from "./db.js";
import songRoutes from "./routes/songs.js";
import reviewRoutes from "./routes/reviews.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/songs", songRoutes);
app.use("/api/songs", reviewRoutes);

// Endpoints
// http://localhost:5000/
app.get("/", (req, res) => {
  res.send("✅ Pansify API is running!");
});

// http://localhost:5000/health
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is alive" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pgClient.query("SELECT NOW()");
    res.json({ dbTime: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "DB connection failed" });
  }
});



// Not found Route
app.use((req, res) => {
  res.status(404).json({ message: "🚫 Route not found" });
});




pgClient.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
