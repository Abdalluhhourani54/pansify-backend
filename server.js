import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Endpoints
// http://localhost:5000/
app.get("/", (req, res) => {
  res.send("✅ Pansify API is running!");
});

// http://localhost:5000/health
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is alive" });
});

// Not found Route
app.use((req, res) => {
  res.status(404).json({ message: "🚫 Route not found" });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
