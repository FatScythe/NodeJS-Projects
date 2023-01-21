const authMiddleware = require("../middleware/auth");

const router = require("express").Router();
const { login, dashboard } = require("../controllers/main");

router.route("/login").post(login);
router.route("/dashboard").get(authMiddleware, dashboard);

module.exports = router;
