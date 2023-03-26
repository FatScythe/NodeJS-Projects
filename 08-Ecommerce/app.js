require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const { set } = require("mongoose");

// Packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// DB
const connectDB = require("./db/connect");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Router
const authRouter = require("./routes/authRoutes");

// Middleware
const notFoundMW = require("./middleware/not-found");
const errorHandlerMW = require("./middleware/error-handler");

app.get("/", async (req, res) => {
  res.send("E-commerce");
});

app.get("/api/v1", async (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("Cookies!!!");
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundMW);
app.use(errorHandlerMW);

const port = process.env.PORT || 5000;
const start = async () => {
  set({ strictQuery: true });
  await connectDB(process.env.MONGO_URI_08);
  app.listen(port, console.log(`Server is listening on ${port}`));
};

start();
