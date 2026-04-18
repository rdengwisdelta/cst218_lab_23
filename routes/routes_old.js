const express = require("express");
const router = express.Router();
const Recipe = require("../recipes/soapRecipes");
const mongoose = require("mongoose");

// CREATE: Add a new item
router.post("/", async (req, res) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ: Get all items & query parameter filters
router.get("/", async (req, res) => {
  try {
    const { keyword } = req.query;
    let filter = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" }; 
    }

    const recipes = await Recipe.find(filter);
    res.status(200).json(recipes);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ: Get one item by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid recipe ID format" });
  }

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Update an item by ID
router.put("/:id", async (req, res) => {
   const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid recipe ID format" });
  }
  
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete an item by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid recipe ID format" });
  }

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;