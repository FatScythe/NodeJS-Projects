const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");
const crypto = require("crypto");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = "http://localhost:3000";

  // const tempOrigin = req.get("origin");
  // console.log(`Origin: ${tempOrigin}`);
  // const protocol = req.protocol;
  // console.log(`protocol: ${protocol}`);
  // const host = req.get("host");
  // console.log(`host: ${host}`);
  // const forwardedHost = req.get("x-forwarded-host");
  // console.log(`forwadedHost: ${forwadedHost}`);
  // const forwadedProtocol = req.get("x-forwarded-proto");
  // console.log(`forwadedProtocol: ${forwadedProtocol}`);

  // console.log(`headers: ${req.headers}`);

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Please check email to verify account" });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError.UnauthenticatedError("User does not exist");

  if (verificationToken !== user.verificationToken)
    throw new CustomError.UnauthenticatedError("Invalid Verification token");

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  if (!user.isVerified)
    throw new CustomError.UnauthenticatedError(
      "Please verify your account, check your email to verify"
    );

  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("User as been suspended");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userToken = { userAgent, ip, refreshToken, user: user._id };

  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) CustomError.BadRequestError("Please provide valid email");

  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    const origin = "http://localhost:3000";
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMins = 1000 * 60 * 60 * 10;

    // hash password on db
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = new Date(Date.now() + tenMins);

    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  if (!email || !token || !password)
    throw new CustomError.BadRequestError("Please fill all fields!");

  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    // compare db hashed pwd and expiration date
    if (
      user.passwordToken === createHash(token) ||
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = "";
      user.passwordTokenExpirationDate = null;

      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({ msg: "Password has been reset" });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
