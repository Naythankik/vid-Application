const User = require("../models/users");

const authentication = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    // check if the user is active
    return !user.isActive
      ? res.status(403).send({ message: "User is not logged in" })
      : next();
  } catch (err) {
    // error if the id is not defined
    throw new Error(err);
  }
};

module.exports = authentication;
