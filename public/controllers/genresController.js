const genres = require("../models/genres");
const users = require("../models/users");
const movies = require("../models/movies");
const Joi = require("joi");

const getGenres = (req, res) => {
  res.status(200).send(genres);
};

const postGenre = (req, res) => {
  res.send(req.body);
};
module.exports = {
  getGenres,
  postGenre,
};
