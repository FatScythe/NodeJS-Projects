const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const { register, login, updateUser } = require("../controllers/auth");
const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    msg: "Too many request from this IP, please try again in 15minutes",
  },
});

router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);
router.patch("/updateUser", authenticateUser, updateUser);

module.exports = router;
