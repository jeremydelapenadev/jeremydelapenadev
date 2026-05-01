const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },

    post_id: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("comment", commentSchema);