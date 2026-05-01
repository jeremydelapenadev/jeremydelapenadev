const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },
  comment_id: {
    type: Schema.Types.ObjectId,
    ref: "comment",
  },
});

// one like per user per post
likeSchema.index(
  { user_id: 1, post_id: 1 },
  {
    unique: true,
    partialFilterExpression: { post_id: { $exists: true } },
  }
);

// one like per user per comment
likeSchema.index(
  { user_id: 1, comment_id: 1 },
  {
    unique: true,
    partialFilterExpression: { comment_id: { $exists: true } },
  }
);

module.exports = mongoose.model("like", likeSchema);