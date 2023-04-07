const { Schema, model, Types } = require("mongoose");

const singleOrderItemSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: Types.ObjectId,
    ref: "Products",
    required: true,
  },
});

const orderSchema = new Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please provide tax amount"],
    },
    shippingFee: {
      type: Number,
      required: [true, "Please provide shipping Fee"],
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: [true, "Please provide total amount"],
    },
    orderItems: {
      type: [singleOrderItemSchema],
      required: [true, "Please provide order items"],
    },
    status: {
      type: String,
      enum: ["pending", "failed", "paid"],
      default: "pending",
    },
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("Orders", orderSchema);
