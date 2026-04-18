const Model = require("../models/Entry.js");

async function getAllItems(req, res) {
  try {
    const items = await Model.find({ userId: req.userId });

    return res.status(200).json({
      message: "Items retrieved",
      data: items
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error retrieving items" });
  }
}

async function createItem(req, res) {
  try {
    const created = await Model.create({
      ...req.body,
      userId: req.userId
    });

    return res.status(201).json({
      message: "Item created",
      data: created
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error creating item" });
  }
}

async function updateItem(req, res) {
  try {
    const updated = await Model.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

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

async function deleteItem(req, res) {
  try {
    const deleted = await Model.findOneAndDelete({
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
  getAllItems,
  createItem,
  updateItem,
  deleteItem
};