const rentals = require("../models/rentals");
const users = require("../models/users");
const movies = require("../models/movies");
const Joi = require("joi");
const date = new Date();

const getRentals = (req, res) => {
  res.status(200).send(rentals);
  return;
};

const postRental = (req, res) => {
  let month = date.getMonth() + 1;

  const schema = Joi.object({
    userId: Joi.number().max(users.length).required(),
    price: Joi.number().required(),
    movieId: Joi.number().max(movies.length).required(),
    rentDuration: Joi.date()
      .less(`${date.getDay()}/${month}/${date.getFullYear()}`)
      .required(),
  });

  //validate the input by the user
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(403).send(error.details[0].message);
    return;
  }

  //Find the movie with the id provided
  const movie = movies.find((val) => val.id === parseInt(value.movieId));

  //if the rentals is less than 1
  if (movie.rentals < 1) {
    res
      .status(403)
      .send({ message: "The movie has reached maximum rent limit" });
    return;
  }

  //and reduce the number of rentals
  movie.rentals -= 1;
  value.id = rentals.length + 1;
  value.price = "$" + value.price;

  rentals.push(value);
  res.status(200).send({ message: "Movie has been rented successfully!" });
  return;
};

const findRental = async (req, res) => {
  const rental = await rentals.filter(
    (rent) => rent.userId == parseInt(req.params.id)
  );

  //   If the value < 1, return error message to the user
  if (rental.length < 1) {
    res.status(403).send({
      message: `The rent(s) with user id of ${req.params.id} not seen, try again.`,
    });
    return;
  }

  res.status(200).send(rental);
  return;
};

const delRental = (req, res) => {
  const rent = rentals.findIndex((ren) => ren.id === parseInt(req.params.id));

  //if the rent is not found return an error message to the user
  if (rent == -1) {
    res
      .status(402)
      .send({ error: `The rent with id, ${req.params.id}, does not exist` });
    return;
  }

  //Delete the rent from the hardcored database
  rentals.splice(rent, 1);

  res.send({
    message: `Rentage with id of ${req.params.id} has been deleted successfully!`,
  });
  return;
};

module.exports = {
  getRentals,
  postRental,
  findRental,
  delRental,
};
