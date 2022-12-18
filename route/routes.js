const express = require("express");
const Joi = require("joi");
const users = require("../public/assets/js/users");
const movies = require("../public/assets/js/movies");

const routers = express.Router();

// The validation for user inputs
function validation(param) {
  let schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    telephone: Joi.number().min(11).required(),
    address: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  });
  let err = schema.validate(param);
  if (err.error) {
    return err.error.details[0].message;
  }
}

// The user controller routes
routers
  .route("/")
  .get((req, res) => {
    res.send(users);
    // res.send({ message: "Welcome to VIDAPP, Signin" });
  })
  .post((req, res) => {
    if (validation(req.body)) {
      res.status(403).send(validation(req.body));
    }
    req.body.id = users.length + 1;
    users.push(req.body);
    res.status(200).send("The user has been registered successfully!");
  });

routers
  .route("/movies")
  .get((req, res) => {
    res.status(200).send(movies);
  })
  .post((req, res) => {
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
  });

routers
  .route("/movie/:id")
  .get((req, res) => {
    const movie = movies.find((val) => val.id === parseInt(req.params.id));
    if (!movie) {
      res.status(403).send({
        warning: `The movie with the id, ${req.params.id} is not found`,
      });
    } else {
      res.status(200).send(movie);
    }
  })
  //The updating user
  .put((req, res) => {
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
  })
  .delete((req, res) => {
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
  });

routers
  .route("/:id")
  // fetching a single user
  .get((req, res) => {
    const user = users.find((val) => val.id === parseInt(req.params.id));
    if (!user) {
      res.status(403).send({
        warning: `The user with the id, ${req.params.id} is not found`,
      });
    } else {
      res.status(200).send(user);
    }
  })
  //The updating user
  .put((req, res) => {
    const updUser = users.find((val) => val.id === parseInt(req.params.id));

    if (!updUser) {
      res.status(403).send({
        warning: `The user with the id, ${req.params.id} is not found`,
      });
    } else {
      (updUser.firstName = req.body.firstName || updUser.firstName),
        (updUser.lastName = req.body.lastName || updUser.lastName),
        (updUser.username = req.body.username || updUser.username),
        (updUser.telephone = req.body.telephone || updUser.telephone),
        (updUser.address = req.body.address || updUser.address),
        (updUser.password = req.body.password || updUser.password),
        res.status(200).send({
          message: `The user with id ${req.params.id} has been updated!`,
        });
    }
  })
  .delete((req, res) => {
    const del = users.findIndex((val) => val.id === parseInt(req.params.id));

    if (del < 0) {
      res.status(403).send({
        warning: `The user with the id, ${req.params.id} is not found`,
      });
    } else {
      users.splice(del, 1);
      res.status(200).json({
        warning: `The user with the id, ${req.params.id} has been deleted`,
      });
    }
  });

module.exports = routers;
