const Movies = require("../models/movies");
const Genre = require("../models/genres");
const Joi = require("joi");

const getGenres = async (req, res) => {
  const genres = await Genre.find().select(["-_id", "-__v"]);
  res.status(200).send(genres);
  return;
};

const postGenre = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }
  const gen = await Genre.create(value);
  return gen
    ? res.send({ message: "The genre has been posted successfully!" })
    : res.status(403).send({ message: "Genre was not posted successfully!" });
};

module.exports = {
  getGenres,
  postGenre,
};
