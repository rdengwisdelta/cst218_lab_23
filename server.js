// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Entry = require("./models/Entry");
const { requireAuth } = require("./middleware/auth");
const entryRoutes = require("./routes/entryRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("dev"));

// force Node DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Assignment 16 starter is running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Helper function to keep responses consistent
function ok(res, message, data = null) {
  return res.status(200).json({ message, data });
}

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "An account with that email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    return res.status(201).json({
      message: "User registered successfully",
      data: { userId: user._id, email: user.email }
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return ok(res, "Login successful", { token });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Protected "who am I" route
app.get("/profile", requireAuth, (req, res) => {
  return ok(res, "You are authenticated", { userId: req.userId, email: req.email });
});

// Mount Entry routes
app.use("/entries", entryRoutes);

// Mount Auth routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
