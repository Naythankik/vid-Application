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
  getMoviesByName,
  getMovieByYear,
  getMovieByRatings,
} = require("../public/controllers/moviesController");

const {
  getRentals,
  postRental,
  findRental,
  delRental,
} = require("../public/controllers/rentalsController");

const {
  getGenres,
  postGenre,
  findMovieByGenre,
} = require("../public/controllers/genresController");

const routers = express.Router();

// The user controller routes
routers.route("/users").get(getUsers).post(postUser);
routers.route("/user/:id").get(findUser).put(updateUser).delete(deleteUser);

// The movies routes
routers.route("/movies").get(getMovies).post(postMovies);
routers.route("/movies/year").get(getMovieByYear);
routers.route("/movies/name").get(getMoviesByName);
routers.route("/movies/ratings").get(getMovieByRatings);
routers.route("/movie/:id").get(getMovie).put(updateMovie).delete(deleteMovie);

//The rentals routes
routers.route("/rentals").get(getRentals).post(postRental);
routers.route("/rental/:id").get(findRental).post(postRental).delete(delRental);

// The Genres routes
routers.route("/genres").get(getGenres).post(postGenre);
routers.route("/genres/:genre").get(findMovieByGenre);
module.exports = routers;
