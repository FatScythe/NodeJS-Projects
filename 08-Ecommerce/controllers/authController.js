const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { createJWT, attachCookiesToResponse } = require("../utils");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please fill all fields");
  }
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const tokenUser = {
    name: user.name,
    role: user.role,
    userId: user._id,
    email: user.email,
  };

  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide name and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials!");
  }

  const tokenUser = {
    name: user.name,
    role: user.role,
    userId: user._id,
    email: user.email,
  };

  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logged out", {
    expires: new Date(Date.now()),
  });
  res.send("User is logged out");
};

module.exports = {
  register,
  login,
  logout,
};
