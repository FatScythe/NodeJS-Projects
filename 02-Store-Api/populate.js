const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const Product = require("./models/product");
const jsonProducts = require("./products.json");
require("dotenv").config();

const populate = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDB(process.env.MONGO_URI_02);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("sucessful!!!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

populate();
