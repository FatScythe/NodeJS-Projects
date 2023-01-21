const jwt = require("jsonwebtoken");
require("dotenv").config();
const { BadRequestError } = require("../errors/index");

// check username, password in post(login) request
// if exist create new JWT
// send back to front-end
// setup authentication so only the request with JWT can access the dasboard

const login = (req, res) => {
  const { username, password } = req.body;
  // mongoose validation
  // Joi
  // check in the controller

  if (!username || !password) {
    throw new BadRequestError("please provide name and password");
  }

  // id is usually provided by the db
  const id = new Date().getTime().toString();

  // try to keep payload small, better experience for user
  // jwt is usually in the format xxxxx.yyyyy.zzzzz, a large unguessable string
  // the sign method takes in 3 things payload, token and options?
  const token = jwt.sign({ id, username }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });

  res.status(200).json({ msg: "User created!", token });
};

const dashboard = (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hi, ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

module.exports = { login, dashboard };
