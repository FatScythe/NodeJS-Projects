require("dotenv").config();
require("express-async-errors");
const mongoose = require("mongoose");
const path = require("path");

const express = require("express");
const app = express();
// file Upload
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// database
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// router
const productRouter = require("./routes/productRoutes");

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/products", productRouter);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./build", "index.html"));
  // res.send("<h1>File Upload Starter</h1>");
});

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.set("strictQuery", true);
    await connectDB(process.env.MONGO_URI_04);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
