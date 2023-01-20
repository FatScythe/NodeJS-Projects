const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "must provide name for product"],
    trim: true,
    max: [30, "max character is 30"],
    min: [4, "min character is 4"],
  },
  price: { type: Number, required: [true, "must provide price for product"] },
  featured: { type: Boolean, default: false },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
    // enum: ["ikea", "liddy", "caressa", "marcos"]
  },
  rating: { type: Number, default: 4.5 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = new model("Products", productSchema);
