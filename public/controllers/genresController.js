const movies = require("../models/movies");
const genres = require("../models/genres");
const Joi = require("joi");

const getGenres = (req, res) => {
  res.status(200).send(genres);
};

const postGenre = (req, res) => {
  const scheme = Joi.object({
    name: Joi.string().required(),
  });

  const { error, value } = scheme.validate(req.body);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  req.body.id = genres.length + 1;
  genres.push(value);

  res.send({ message: "The genre has been posted successfully!" });
};

const findMovieByGenre = (req, res) => {
  const movie = movies.filter((MovieGenre) =>
    MovieGenre.genre.includes(
      req.params.genre[0].toUpperCase() + req.params.genre.slice(1)
    )
  );

  movie.length < 1
    ? res.status(403).send({ meesgae: "No movie for the genre" })
    : res.send(movie);
};

module.exports = {
  getGenres,
  postGenre,
  findMovieByGenre,
};
