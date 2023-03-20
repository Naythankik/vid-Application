const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authentication = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(403).send({ message: "A token is required for authentication" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      throw new Error(err);
    }
    return next();
  }
};

const authorization = (req, res, next) => {
  const admin = req.user;
  console.log(admin);
};

module.exports = { authentication, authorization };
