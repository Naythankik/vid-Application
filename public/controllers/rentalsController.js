const rentals = require("../models/rentals");
const users = require("../models/users");
const movies = require("../models/movies");
const Joi = require("joi");

const getRentals = (req, res) => {
  res.status(200).send(rentals);
};

const postRental = (req, res) => {
  const schema = Joi.object({
    userId: Joi.number().max(users.length).required(),
    price: Joi.number().required(),
    movieId: Joi.number().max(movies.length).required(),
    rentDuration: Joi.required(),
  });

  const err = schema.validate(req.body);
  if (err.error) {
    res.status(401).send(err.error.details[0].message);
    return;
  }
  req.body.price = "$" + req.body.price;

  rentals.push(req.body);
  res.status(200).send(rentals);
};

module.exports = {
  getRentals,
  postRental,
};
