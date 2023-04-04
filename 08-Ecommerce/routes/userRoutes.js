const router = require("express").Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router
  .route("/")
  .get([authenticateUser, authorizePermissions("admin")], getAllUsers);
router
  .route("/show")
  .get(
    [authenticateUser, authorizePermissions("admin", "user")],
    showCurrentUser
  );
router.route("/update").patch(authenticateUser, updateUser);
router.route("/updatePwd").patch(authenticateUser, updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
