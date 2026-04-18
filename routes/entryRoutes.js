const express = require("express");
const router = express.Router();

// Import controller functions (you will create these next)
const {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require("../controllers/entryController.js");

//<Middleware>
const { requireAuth } = require("../middleware/auth.js");
const { validateObjectId } = require("../middleware/validateObjectId.js");
const { validateTitle } = require("../middleware/validateTitle.js");

// Example routes
router.get("/", getAllRecipes);
router.post("/", requireAuth, validateTitle, createRecipe);
router.put("/:id", requireAuth, validateObjectId, updateRecipe);
router.delete("/:id", requireAuth, validateObjectId, deleteRecipe);

module.exports = router;