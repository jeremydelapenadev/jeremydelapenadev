const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, trim: true, required: true },
    content: { type: String, required: true },
    status: { type: String, default: "draft" },
    image_url: { type: String },

    author_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("post", postSchema);