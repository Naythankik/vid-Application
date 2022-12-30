const express = require("express");

const {
  getUsers,
  postUser,
  findUser,
  updateUser,
  deleteUser,
} = require("../public/controllers/usersController");

const {
  getMovies,
  postMovies,
  getMovie,
  updateMovie,
  deleteMovie,
} = require("../public/controllers/moviesController");

const {
  getRentals,
  postRental,
} = require("../public/controllers/rentalsController");

const {
  getGenres,
  postGenre,
} = require("../public/controllers/genresController");

const routers = express.Router();

// The user controller routes
routers.route("/users").get(getUsers).post(postUser);
routers.route("/user/:id").get(findUser).put(updateUser).delete(deleteUser);

// The movies routes
routers.route("/movies").get(getMovies).post(postMovies);
routers.route("/movie/:id").get(getMovie).put(updateMovie).delete(deleteMovie);

//The rentals routes
routers.route("/rentals").get(getRentals).post(postRental);

// The Genres routes
routers.route("/genres").get(getGenres).post(postGenre);

module.exports = routers;
