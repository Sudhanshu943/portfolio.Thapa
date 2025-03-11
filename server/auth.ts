import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Example route (authentication removed)
app.get("/api/user", (req, res) => {
  res.json({ message: "Authentication removed" });
});

export default app;
