const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db/taskDB");
const app = express();
const taskRouter = require("./routes/taskRoutes");
require("dotenv").config();
const notFound = require("./middleware/notFound");
const handleError = require("./middleware/error-handler");

// middleware
app.use(express.static("./01-Task-Manager/public"));
app.use(express.json());

// router
app.use("/api/v1/tasks", taskRouter);

app.use(notFound);
app.use(handleError);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDB(process.env.MONGO_URI_01);
    console.log("Connected to DB");
    app.listen(port, console.log(`Server is listening on port : ${port}...`));
  } catch (error) {
    console.log(error, "Error from db or server");
  }
};

start();
