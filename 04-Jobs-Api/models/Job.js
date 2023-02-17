const { Schema, model, Types } = require("mongoose");

const JobSchema = Schema(
  {
    company: {
      type: String,
      required: [true, "Please Provide Company Name"],
      minlength: [3, "Mininmum Character is 3"],
      maxlength: [50, "Maximum Character is 50"],
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Please provide User!"],
    },
  },
  { timestamps: true }
);

module.exports = model("Job", JobSchema);
