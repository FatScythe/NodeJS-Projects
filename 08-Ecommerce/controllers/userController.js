const User = require("../models/User");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermisson,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  const numberOfUsers = await User.countDocuments({});
  res.status(StatusCodes.OK).json({ nb: numberOfUsers, users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id: ${id}`);
  }
  checkPermisson(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!name || !email) {
    throw new BadRequestError("Please fill all fields");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Update user with model.save()
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Fill all fields");
  }

  const user = await User.findOne({ id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid Credentials!!!");
  }

  user.password = newPassword;

  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ msg: "Success!! Password as been updated" });
};

// Update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!name || !email) {
//     throw new BadRequestError("Please fill all fields");
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email }, {new: true ,runValidators: true}
//   );

//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse(res, tokenUser);

//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
