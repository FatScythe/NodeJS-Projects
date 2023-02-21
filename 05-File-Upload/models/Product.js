const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide name for the product"],
  },
  price: {
    type: Number,
    required: [true, "Please provide price for the product"],
  },
  image: {
    type: String,
    required: [true, "Please provide image path for the product"],
  },
});

module.exports = model("Products", ProductSchema);
