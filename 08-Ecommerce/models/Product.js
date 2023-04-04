const { Schema, Types, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: ["true", "Please provide name"],
      maxLength: [100, "Maximum of 100 character"],
    },
    price: {
      type: Number,
      require: ["true", "Please provide price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: { type: String, default: "/uploads/example.jpeg" },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: { type: [String], default: ["#222"], required: true },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    inventory: { type: Number, required: true, default: 0 },
    averageRating: { type: Number, default: 0 },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Reviews",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  // match: { rating: 1 },
});

productSchema.pre("remove", async function () {
  await this.model("Reviews").deleteMany({ product: this._id });
});

module.exports = model("Products", productSchema);
