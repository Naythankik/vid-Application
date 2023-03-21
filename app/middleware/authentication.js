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

const authorization = async (req, res, next) => {
  try {
    const { id } = req.user;
    const admin = await User.findById(id);
    if (admin.role !== "admin") {
      throw new Error("User is not an admin");
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { authentication, authorization };
