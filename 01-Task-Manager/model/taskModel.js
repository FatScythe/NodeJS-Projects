const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  name: {
    type: String,
    required: [true, "must Provide name"],
    min: [2, "Too few characters"],
    max: [20, "max character limit is 20"],
  },
  completed: { type: Boolean, default: false },
});

module.exports = model("Task", taskSchema);
