// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const { requireAuth } = require("./middleware/auth");
const entryRoutes = require("./routes/entryRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("dev"));

// force Node DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT;

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

// Protected "who am I" route
app.get("/profile", requireAuth, (req, res) => {
  return ok(res, "You are authenticated", { userId: req.userId, email: req.email });
});

// Mount Entry routes
app.use("/recipes", entryRoutes);

// Mount Auth routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
