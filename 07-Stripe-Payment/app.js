require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const path = require("path");

// controller
const stripeController = require("./controllers/stripeController");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./public")));

// stripe
app.get("/", async (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});
app.post("/stripe", stripeController);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
