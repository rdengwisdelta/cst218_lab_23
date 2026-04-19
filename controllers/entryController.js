const SoapRecipe = require("../models/soapRecipe");

async function getAllRecipes(req, res) {
  try {
    const filter = { userId: req.userId };

    if (req.query.category) {
      filter.category = new RegExp(req.query.category, "i");
    }

    const items = await SoapRecipe.find(filter);

    return res.status(200).json({
      message: "Recipes retrieved",
      data: items
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error retrieving recipes" });
  }
}

async function createRecipe(req, res) {
  try {
    const created = await SoapRecipe.create({
      ...req.body,
      userId: req.userId
    });

    if (!req.body.category || req.body.category.trim() === "") {
      return res.status(400).json({ error: "Category is required" });
    }

    return res.status(201).json({
      message: "Item created",
      data: created
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error creating item" });
  }
}

async function updateRecipe(req, res) {
  try {
    const updated = await SoapRecipe.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!req.body.category || req.body.category.trim() === "") {
    return res.status(400).json({ error: "Category is required" });
    }

    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({
      message: "Item updated",
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error updating item" });
  }
}

async function deleteRecipe(req, res) {
  try {
    const deleted = await SoapRecipe.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({
      message: "Item deleted",
      data: deleted
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error deleting item" });
  }
}

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe
};