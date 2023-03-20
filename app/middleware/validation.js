const Joi = require("joi");

function userValidation(param) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    telephone: Joi.number().min(11).required(),
    address: Joi.string().min(3).required(),
    password: Joi.string().required(),
    role: Joi.string().valid("user", "admin"),
  });

  return schema.validate(param);
}

const movieValidation = (param) => {
  const movie = Joi.object({
    title: Joi.string().min(2).required(),
    year: Joi.number().integer().required(),
    director: Joi.string().min(5).required(),
    duration: Joi.string().required(),
    genre: Joi.array().min(2).required(),
    ratings: Joi.number(),
  });

  return movie.validate(param.body);
};

const rentalValidation = (param) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    price: Joi.number().required(),
    movieUuid: Joi.string().required(),
  });

  return schema.validate(param);
};

module.exports = { userValidation, movieValidation, rentalValidation };
