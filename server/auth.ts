import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Remove session-based authentication logic
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
}));

// Example route (authentication removed)
app.get("/api/user", (req, res) => {
  res.json({ message: "Authentication removed" });
});

export default app;
