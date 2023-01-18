const Task = require("../model/taskModel");
const asyncWrapper = require("../middleware/aysncWrapper");
const { createCustomError } = require("../errors/custom-error");

// GETS ALL THE TASKS
const getTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
});

// GETS A SPECIFIC TASK
const getTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findOne({ _id: id });
  if (!task) {
    return next(createCustomError(`No task with the ID: ${id}`, 404));
  }
  res.status(200).json({ task });
});

// POST TASK
const postTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

// DELETE TASK
const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id });
  if (!task) {
    return next(createCustomError(`No task with the ID: ${id}`, 404));
  }
  res.status(200).json({ task });
});

//UPDATE TASK
const updateTask = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, completed } = req.body;
  const task = await Task.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    return next(createCustomError(`No task with the ID: ${id}`, 404));
  }
  res.status(200).json({ task });
});

module.exports = {
  getTasks,
  getTask,
  postTask,
  deleteTask,
  updateTask,
};
