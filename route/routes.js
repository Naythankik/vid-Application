const express = require("express");

const {
  getUsers,
  findUser,
  login,
  updateUser,
  deleteUser,
  logout,
  createUser,
  forgetPassword,
  resetPassword,
} = require("../app/controllers/usersController");

const {
  getMovies,
  postMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  rentMovie,
  viewRent,
  deleteRent,
} = require("../app/controllers/moviesController");

const { getRentals } = require("../app/controllers/rentalsController");

const { getGenres, postGenre } = require("../app/controllers/genresController");

const {
  authentication,
  authorization,
} = require("../app/middleware/authentication");

const routers = express.Router();

routers.post("/login", login).post("/logout", logout);

routers.post("/forget-password", forgetPassword);
routers.post("/resetPassword/:token", resetPassword);

routers
  .route("/users")
  .get(authentication, authorization, getUsers)
  .post(createUser);
routers
  .use(authentication)
  .route("/user/genres")
  .get(getGenres)
  .post(authorization, postGenre);

routers
  .use(authentication)
  .route("/user/movies")
  .get(getMovies)
  .post(authorization, postMovies);

routers.route("/user/rentals").get(authentication, authorization, getRentals);

routers
  .route("/user/:id")
  .get(findUser)
  .put(authentication, updateUser)
  .delete(authentication, deleteUser);

routers
  .use(authentication)
  .route("/user/movie/:uuid")
  .get(getMovie)
  .put(authorization, updateMovie)
  .delete(authorization, deleteMovie);

routers
  .use(authentication)
  .route("/user/movie/:uuid/rent")
  .post(rentMovie)
  .delete(deleteRent)
  .get(viewRent);

module.exports = routers;
