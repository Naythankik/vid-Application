const express = require("express");

const {
  getUsers,
  postUser,
  findUser,
  login,
  updateUser,
  deleteUser,
  logout,
} = require("../app/controllers/usersController");

const {
  getMovies,
  postMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getMoviesByName,
  getMovieByYear,
  getMovieByRatings,
} = require("../app/controllers/moviesController");

const {
  getRentals,
  postRental,
  findRental,
  delRental,
} = require("../app/controllers/rentalsController");

const {
  getGenres,
  postGenre,
  findMovieByGenre,
} = require("../app/controllers/genresController");

const authentication = require("../app/middleware/authentication");

const routers = express.Router();

routers.route("/users").get(getUsers).post(postUser);
routers.route("/user/genres").get(getGenres).post(postGenre);
routers.route("/user/movies").get(getMovies).post(postMovies);
routers.route("/user/rentals").get(getRentals).post(postRental);
routers
  .route("/user/movie/:uuid")
  .get(getMovie)
  .put(updateMovie)
  .delete(deleteMovie);

routers.route("/user/movies/ratings").get(getMovieByRatings);
routers.route("/user/movies/year").get(getMovieByYear);
routers.route("/user/movies/name").get(getMoviesByName);

// routes with parameters
routers
  .route("/user/:id")
  .get(findUser)
  .put(authentication, updateUser)
  .delete(authentication, deleteUser);
routers.post("/login", login).post("/logout", logout);

// The movies routes

//The rentals routes
routers.route("/user/rental/:uuid").get(findRental).delete(delRental);

// The Genres routes
routers.route("/user/genres/:genre").get(findMovieByGenre);
module.exports = routers;
