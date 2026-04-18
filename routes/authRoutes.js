const express = require("express");
const router = express.Router();

// Import controller functions from authController
const { register, login } = require("../controllers/authController");

// Register and login routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;