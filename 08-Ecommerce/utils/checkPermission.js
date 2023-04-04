const { UnauthorizedError } = require("../errors");

const checkPermisson = (requestUser, resourceUserId) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  // console.log(requestUser === resourceUserId.toString());
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new UnauthorizedError(
    "Unauthorized to access the resource(s) on this route"
  );
};

module.exports = checkPermisson;
