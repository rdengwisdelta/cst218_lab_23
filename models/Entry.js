const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entry", EntrySchema);
