const express = require("express");
const app = express();
require("express-async-errors");
const errorMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const productRouter = require("./routes/products");
require("dotenv").config();

app.get("/", (req, res) => {
  res.send('<h1>Store API </h1> <a href="/api/v1/products">Products</a>');
});

// Product Route
app.use("/api/v1/products", productRouter);
app.use(notFound);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDB(process.env.MONGO_URI_02);
    app.listen(port, console.log(`Server is listening on port: ${port}...`));
  } catch (err) {
    console.error(err);
  }
};

start();
