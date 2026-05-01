const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  password_hash: { type: String, required: true },
  bio: { type: String },
  role: { type: String, default: "user" },
  favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "space",
    },
  ],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);

// The "user" mentioned in the above line should be in
// lowercase singular form ..whereas the actual collection
// name in mongodb will be in the plural form.
// Refer to mongoose documentation for more: https://www.npmjs.com/package/mongoose
// The first argument is the singular name of your collection.
// Mongoose automatically looks for the lowercase plural version. For example, if you use
// const MyModel = mongoose.model('Ticket', mySchema);
// Then MyModel will use the tickets collection, not the Ticket collection.
