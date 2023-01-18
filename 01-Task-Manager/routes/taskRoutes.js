const express = require("express");
const {
  getTasks,
  getTask,
  postTask,
  deleteTask,
  updateTask,
} = require("../controller/tasks");
const router = express.Router();

router.get("/", getTasks);

router.get("/:id", getTask);

router.post("/", postTask);

router.delete("/:id", deleteTask);

router.patch("/:id", updateTask);

module.exports = router;
