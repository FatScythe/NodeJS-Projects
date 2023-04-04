require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const { set } = require("mongoose");
const path = require("path");

// Packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// DB
const connectDB = require("./db/connect");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());
app.use(express.static(path.resolve(__dirname, "./public")));

// Router
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");

// Middleware
const notFoundMW = require("./middleware/not-found");
const errorHandlerMW = require("./middleware/error-handler");

app.get("/", async (req, res) => {
  res.send("E-commerce");
});

app.get("/api/v1", async (req, res) => {
  // for normal cookies
  console.log(req.cookies);
  // for signed cookies
  console.log(req.signedCookies);
  res.send("Cookies!!!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(notFoundMW);
app.use(errorHandlerMW);

const port = process.env.PORT || 5000;
const start = async () => {
  set({ strictQuery: true });
  await connectDB(process.env.MONGO_URI_08);
  app.listen(port, console.log(`Server is listening on ${port}`));
};

start();
