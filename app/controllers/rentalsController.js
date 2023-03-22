const Rentals = require("../models/rentals");
const Users = require("../models/users");
const Movies = require("../models/movies");

const getRentals = async (req, res) => {
  const rentals = await Rentals.find();
  res.status(200).send(rentals);
  return;
};

module.exports = {
  getRentals,
};
