const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    excerpt: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String, // URL
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    tags: {
      type: [String],
      default: [],
    },

    views: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);