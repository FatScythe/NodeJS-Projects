const { isTokenValid } = require("../utils");
const { UnauthenticatedError, UnauthorizedError } = require("../errors");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  try {
    const { name, role, userId, email } = isTokenValid(token);
    req.user = { name, role, userId, email };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorize to access this route");
    }
    next();
  };
};
module.exports = {
  authenticateUser,
  authorizePermissions,
};
