const Rentals = require("../models/rentals");
const Users = require("../models/users");
const Movies = require("../models/movies");
const { rentalValidation } = require("../middleware/validation");

const getRentals = async (req, res) => {
  const rentals = await Rentals.find();
  res.status(200).send(rentals);
  return;
};

const postRental = async (req, res) => {
  //validate the input by the user
  const { error, value } = rentalValidation(req.body);
  if (error) {
    res.status(403).send(error.details[0].message);
    return;
  }

  //check if the user is active
  const users = await Users.findOne({ _id: req.body.userId });

  if (!users.isActive) {
    res.send({ message: "User is not active, you need to login" });
    return;
  }

  //Find the movie with the id provided
  const movie = await Movies.findOne({ uuid: req.body.movieUuid });

  //check if the same user has rented movie before
  const findRent = await Rentals.findOne({
    movieUuid: movie.uuid,
    userId: value.userId,
  });

  if (findRent !== null) {
    res
      .status(404)
      .send({ message: "You have this movie in your rented  cart" });
    return;
  }

  //if the rentals is less than 1
  if (movie.rentals < 1) {
    res
      .status(403)
      .send({ message: "The movie has reached maximum rent limit" });
    return;
  }

  //the number of rentals should decrease
  movie.rentals -= 1;

  try {
    const newRent = await Rentals.create(value);

    if (newRent) {
      await Movies.findOneAndUpdate(
        { uuid: req.body.movieUuid },
        { rentals: movie.rentals }
      );
    }
    res.status(200).send({ message: "Movie has been rented successfully!" });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getRentals,
  postRental,
};
