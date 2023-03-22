const Movies = require("../models/movies");
const { movieValidation } = require("../middleware/validation");
const Rent = require("../models/rentals");

const getMovies = async (req, res) => {
  const query = {};

  //select movie by ratings
  if (req.query.ratings) {
    query.ratings = { $gte: req.query.ratings };
  }

  //select movie by year
  if (req.query.year) {
    query.year = { $gte: req.query.year };
  }

  //select by name
  if (req.query.name) {
    query.title = req.query.name;
  }

  //select by genre
  if (req.query.genre) {
    // check if the query contains more than one string
    if (req.query.genre.includes(",")) {
      const string = req.query.genre.split(",");
      req.query.genre = string;
    }
    query.genre = { $in: req.query.genre };
  }

  const movie = await Movies.find(query).select(["-_id"]);

  if (movie.length === 0) {
    res.status(404).send({ error: "Nothing found!" });
    return;
  }

  res.send(movie);
};

const postMovies = async (req, res) => {
  const { error, value } = movieValidation(req);
  if (error) {
    res.status(406).send(error.details[0].message);
    return;
  }
  try {
    await Movies.create(value);

    res.status(200).send("Movie has been added to the movies list!");
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const getMovie = async (req, res) => {
  try {
    const movie = await Movies.findOne({ uuid: req.params.uuid }).select([
      "-_id",
    ]);
    return !movie
      ? res.status(404).send({
          warning: `The movie with the id, ${req.params.id} is not found`,
        })
      : res.status(200).send(movie);
  } catch (error) {
    throw new Error(error);
  }
};

const rentMovie = async (req, res) => {
  const { uuid } = req.params;
  try {
    const movie = await Movies.findOne({ uuid });

    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    } else {
      const rentExist = await Rent.findOne({
        user: req.user.id,
        movie: movie.id,
      });

      if (rentExist) {
        throw new Error("Movie has been rented already");
      } else {
        const rent = await Rent.create({
          user: req.user.id,
          movie: movie.id,
        });
        res.status(200).send({ message: "Movie, rented successfully" });
        return;
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

const viewRent = async (req, res) => {
  const { uuid } = req.params;

  //find movie
  try {
    const movie = await Movies.findOne({ uuid });

    if (!movie) throw new Error("Movie does not exist");

    try {
      const rent = await Rent.findOne({
        movie: movie.id,
        user: req.user.id,
      })
        .populate(["movie"])
        .select(["movie", "-_id"]);

      res.status(200).send(rent);
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
  }
};
const deleteRent = async (req, res) => {
  const { uuid } = req.params;

  //find movie
  try {
    const movie = await Movies.findOne({ uuid });

    if (!movie) throw new Error("Movie does not exist");

    try {
      await Rent.findOneAndDelete({
        movie: movie.id,
        user: req.user.id,
      });

      res.status(200).send({ message: "Rent has been deleted" });
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const updateMovie = async (req, res) => {
  try {
    const upMovie = await Movies.findOneAndUpdate(
      { uuid: req.params.uuid },
      req.body
    );
    if (!upMovie) {
      res.status(404).send({
        warning: `The user with the id, ${req.params.uuid} is not found`,
      });
      return;
    }

    res.status(200).send({
      message: `The movie has been updated!`,
    });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const delMovie = await Movies.findOneAndDelete({ uuid: req.params.uuid });

    if (!delMovie) {
      res.status(404).send({
        warning: `The movie with the id, ${req.params.uuid} is not found`,
      });
      return;
    } else {
      res.status(200).json({
        message: `The movie with the id, ${req.params.uuid} has been deleted`,
      });
      return;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getMovies,
  postMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  rentMovie,
  viewRent,
  deleteRent,
};
