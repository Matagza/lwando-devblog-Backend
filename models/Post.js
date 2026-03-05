const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Technology", "Startup", "Tutorial", "Opinion", "Lifestyle"],
  },
  image: {
    type: String,
    default: "",
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
