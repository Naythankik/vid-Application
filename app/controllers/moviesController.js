const Movies = require("../models/movies");
const Joi = require("joi");
const { movieValidation } = require("../middleware/validation");

const getMovies = async (req, res) => {
  try {
    const movies = await Movies.find().select(["-_id"]);
    res.status(200).send(movies);
  } catch (error) {
    throw new Error(error);
  }
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

const getMoviesByName = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string(),
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    res.status(403).send({ error: error.details[0].message });
    return;
  }

  try {
    const film = await Movies.findOne(value).select(["-_id"]);

    if (!film) {
      res.status(404).send({
        error: `The movie with title, ${value.title}, not found, Try another search`,
      });
      return;
    }
    res.status(200).send(film);
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const getMovieByYear = async (req, res) => {
  const year = await Movies.find({ year: { $gte: req.query.year } }).select([
    "-_id",
  ]);

  if (year.length < 1) {
    res.status(404).send({ error: "No movie for that speciifed year" });
    return;
  }
  res.status(200).send(year);
  return;
};

const getMovieByRatings = async (req, res) => {
  const ratings = await Movies.find({
    ratings: { $gte: req.query.ratings },
  }).select(["-_id"]);

  return !ratings.length > 0
    ? res.send({ error: "No movie(s) with the rating" })
    : res.status(200).send(ratings);
};

module.exports = {
  getMovies,
  postMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getMoviesByName,
  getMovieByYear,
  getMovieByRatings,
};
