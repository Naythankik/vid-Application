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

  //Find the movie with the id provided
  const movie = movies.find((val) => val.id === parseInt(req.body.movieId));

  //if the rentals is < 1
  if (movie.rentals < 1) {
    res.status(403).send({ message: "The movie has reached max. rent limit" });
    return;
  }

  //and reduce the number of rentals
  movie.rentals -= 1;
  req.body.price = "$" + req.body.price;

  rentals.push(req.body);
  res.status(200).send({ message: "Movie has been rented successfully!" });
};

const findRental = (req, res) => {
  const rental = rentals.filter(
    (rent) => rent.userId == parseInt(req.params.id)
  );

  //   If the value < 1, return error message to the user
  if (rental.length < 1) {
    return res.status(400).send({
      message: `The rental with id of ${req.params.id} not seen, try again.`,
    });
  }

  res.status(200).send(rental);
};

module.exports = {
  getRentals,
  postRental,
  findRental,
};
