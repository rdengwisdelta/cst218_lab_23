const express = require("express");
const Entry = require("../models/Entry");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Helper to keep response shape consistent
function ok(res, message, data = null) {
  return res.status(200).json({ message, data });
}

// CREATE (protected)
// POST /entries
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: "title and body are required" });
    }

    const entry = await Entry.create({
      userId: req.userId,
      title,
      body,
      tags: tags || []
    });

    return res.status(201).json({ message: "Entry created", data: entry });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// READ ALL (protected)
// GET /entries
// Returns ONLY entries owned by the current user
router.get("/", requireAuth, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.userId }).sort({ createdAt: -1 });
    return ok(res, "Your entries", entries);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// READ ONE (protected)
// GET /entries/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const entry = await Entry.findOne({ _id: req.params.id, userId: req.userId });

    if (!entry) {
      // This covers both "doesn't exist" and "exists but not yours"
      return res.status(404).json({ error: "Entry not found" });
    }

    return ok(res, "Entry found", entry);
  } catch (err) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
});

// UPDATE (protected)
// PUT /entries/:id
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Entry.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Entry not found" });
    }

    return ok(res, "Entry updated", updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE (protected)
// DELETE /entries/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ error: "Entry not found" });
    }

    return ok(res, "Entry deleted", { id: deleted._id });
  } catch (err) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
});

module.exports = router;
