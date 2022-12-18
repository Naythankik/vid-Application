const movies = require("../models/movies");
const path = require("path");
const Joi = require("joi");

const getMovies = (req, res) => {
  res.status(200).send(movies);
  //   res.sendFile(path.join(__dirname, "../views/movies/movie.html"));
};

const postMovies = (req, res) => {
  const movie = Joi.object({
    title: Joi.string().min(2).required(),
    year: Joi.number().integer().required(),
    director: Joi.string().min(5).required(),
    duration: Joi.string().required(),
    genre: Joi.array().min(2).required,
    score: Joi.number(),
  });

  const movErr = movie.validate(req.body);
  if (movErr.error) {
    res.status(403).send(movErr.error.details[0].message);
  } else {
    req.body.id = movies.length + 1;
    movies.push(req.body);
    res.status(200).send("Movie has been added to the movies list!");
  }
};

const getMovie = (req, res) => {
  const movie = movies.find((val) => val.id === parseInt(req.params.id));
  if (!movie) {
    res.status(403).send({
      warning: `The movie with the id, ${req.params.id} is not found`,
    });
  } else {
    res.status(200).send(movie);
  }
};

const updateMovie = (req, res) => {
  const upMovie = movies.find((val) => val.id === parseInt(req.params.id));

  if (!upMovie) {
    res.status(403).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
  } else {
    (upMovie.title = req.body.title || upMovie.title),
      (upMovie.year = req.body.year || upMovie.year),
      (upMovie.director = req.body.director || upMovie.director),
      (upMovie.duration = req.body.duration || upMovie.duration),
      (upMovie.genre = req.body.genre || upMovie.genre),
      (upMovie.score = req.body.score || upMovie.score),
      res.status(200).send({
        message: `The movie with id ${req.params.id} has been updated!`,
      });
  }
};

const deleteMovie = (req, res) => {
  const delMovie = movies.findIndex(
    (val) => val.id === parseInt(req.params.id)
  );

  if (delMovie < 0) {
    res.status(403).send({
      warning: `The movie with the id, ${req.params.id} is not found`,
    });
  } else {
    movies.splice(delMovie, 1);
    res.status(200).json({
      warning: `The movie with the id, ${req.params.id} has been deleted`,
    });
  }
};
module.exports = {
  getMovies,
  postMovies,
  getMovie,
  updateMovie,
  deleteMovie,
};
