const router = require("express").Router();
const {
  getAllProductsStatic,
  getAllProducts,
} = require("../controllers/products");

// TESTING
router.get("/static", getAllProductsStatic);

// API
router.get("/", getAllProducts);

module.exports = router;
