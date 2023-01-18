const movies = require("../models/movies");
const Joi = require("joi");

const getMovies = (req, res) => {
  res.status(200).send(movies);
};

const postMovies = (req, res) => {
  const movie = Joi.object({
    title: Joi.string().min(2).required(),
    year: Joi.number().integer().required(),
    director: Joi.string().min(5).required(),
    duration: Joi.string().required(),
    genre: Joi.array().min(2).required(),
    score: Joi.number(),
    rentals: Joi.number().required(),
  });

  const { error, value } = movie.validate(req.body);
  if (error) {
    res.status(406).send(error.details[0].message);
    return;
  } else {
    value.id = movies.length + 1;
    movies.push(value);

    res.status(200).send("Movie has been added to the movies list!");
    return;
  }
};

const getMovie = (req, res) => {
  const movie = movies.find((val) => val.id === parseInt(req.params.id));
  if (!movie) {
    res.status(404).send({
      warning: `The movie with the id, ${req.params.id} is not found`,
    });
    return;
  } else {
    res.status(200).send(movie);
    return;
  }
};

const updateMovie = (req, res) => {
  const upMovie = movies.find((val) => val.id === parseInt(req.params.id));

  if (!upMovie) {
    res.status(404).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
    return;
  } else {
    upMovie.title = req.body.title || upMovie.title;
    upMovie.year = req.body.year || upMovie.year;
    upMovie.director = req.body.director || upMovie.director;
    upMovie.duration = req.body.duration || upMovie.duration;
    upMovie.genre = req.body.genre || upMovie.genre;
    upMovie.score = req.body.score || upMovie.score;
    upMovie.rentals = req.body.rentals || upMovie.rentals;

    res.status(200).send({
      message: `The movie with id ${req.params.id} has been updated!`,
    });
    return;
  }
};

const deleteMovie = (req, res) => {
  const delMovie = movies.findIndex(
    (val) => val.id === parseInt(req.params.id)
  );

  if (delMovie < 0) {
    res.status(404).send({
      warning: `The movie with the id, ${req.params.id} is not found`,
    });
    return;
  } else {
    movies.splice(delMovie, 1);
    res.status(200).json({
      message: `The movie with the id, ${req.params.id} has been deleted`,
    });
    return;
  }
};

const getMoviesByName = (req, res) => {
  const schema = Joi.object({
    name: Joi.string(),
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    res.status(403).send({ error: error.details[0].message });
    return;
  }
  const films = movies.filter((film) => film.title.includes(value.name));

  if (!films.length > 0) {
    res.status(404).send({
      error: `The movie with title, ${value.name}, not found, Try another search`,
    });
    return;
  }
  res.status(200).send(films);
  return;
};

const getMovieByYear = (req, res) => {
  const year = movies.filter(
    (movie) => movie.year === parseInt(req.query.year)
  );

  if (year.length < 1) {
    res.status(404).send({ error: "No movie for that speciifed year" });
    return;
  }
  res.status(200).send(year);
  return;
};

const getMovieByRatings = (req, res) => {
  const ratings = movies.filter(
    (movie) => movie.score >= parseInt(req.query.rating)
  );

  !ratings.length > 0
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
