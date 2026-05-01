const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    space_id: {
      type: Schema.Types.ObjectId,
      ref: "space",
      required: true,
    },

    author_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    title: {
      type: String,
      trim: true,
      required: true,
    },

    content: {
      type: String,
      trim: true,
      required: true,
    },

    likes: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("review", reviewSchema);
