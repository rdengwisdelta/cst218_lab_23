const mongoose = require("mongoose");

const soapRecipeSchema = new mongoose.Schema(
  {
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    title: { 
    type: String,
    required: [true, "Recipe name required"],
    trim: true
    },
    fats: {
    type: String,
    required: [true, "Fats are required"]
    },
    oils: {
    type: String,
    required: [true, "Oils are required"]
    },
    additives: {
    type: String,
    default: "None"
    }
  
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoapRecipe", soapRecipeSchema);
