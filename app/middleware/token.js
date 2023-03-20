const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "2h" });
};

module.exports = generateToken;
