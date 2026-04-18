const express = require("express");
const router = express.Router();

// Import controller functions (you will create these next)
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/entryController_old.js");

//<Middleware>
const { requireAuth } = require("../middleware/auth.js");
const { validateObjectId } = require("../middleware/validateObjectId.js");
const { validateTitle } = require("../middleware/validateTitle.js");

// Example routes
router.get("/", getAllItems);
router.post("/", requireAuth, validateTitle, createItem);
router.put("/:id", requireAuth, validateObjectId, updateItem);
router.delete("/:id", requireAuth, validateObjectId, deleteItem);

module.exports = router;