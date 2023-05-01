const { Schema, model, Types } = require("mongoose");

const tokenSchema = new Schema({
  refreshToken: { type: String, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  user: { type: Types.ObjectId, ref: "Users", required: true },
});

module.exports = model("Token", tokenSchema);
