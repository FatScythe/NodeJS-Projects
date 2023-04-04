const { Schema, Types, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please Provide Rating"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please Provide title"],
      maxLength: [50, "Max length of Character is 50"],
    },
    comment: {
      type: String,
      required: [true, "Please Provide comment"],
      maxLength: [500, "Max length of Character is 500"],
    },
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: [true, "Please Provide a User"],
    },
    product: {
      type: Types.ObjectId,
      ref: "Products",
      required: [true, "Please Provide a Product"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = model("Reviews", reviewSchema);
