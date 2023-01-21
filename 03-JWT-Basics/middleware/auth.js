const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnAuthError } = require("../errors/index");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthError("No token Provided!");
  }
  const token = authHeader.split(" ")[1];
  try {
    // Checks if the token from the request = token in res
    // returns payload if it checks out
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnAuthError("Not authorized to access this route");
  }
};

module.exports = authMiddleware;
