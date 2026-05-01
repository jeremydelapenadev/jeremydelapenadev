const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spaceSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  council: { type: String, trim: true },
  image_url: { type: String, trim: true },
  about: { type: String, trim: true },

  autism_friendly_features: [{ type: String }],
  cost: { type: String, trim: true },
  tags: [{ type: String }],
  age_suitability: { type: String, trim: true },
  accessibility_features: [{ type: String }],

  address: { type: String, trim: true, default: "" },

  noise_level: {
    type: String,
    enum: ["Very Quiet", "Moderate", "Loud", ""],
    default: ""
  },

  quiet_hours: { type: String, trim: true, default: "" },

  verified: { type: Boolean, default: true },
  author_type: {
    type: String,
    enum: ["developer", "user"],
    default: "developer"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("space", spaceSchema);