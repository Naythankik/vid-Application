const users = require("../models/users");
const path = require("path");
const Joi = require("joi");

// The validation for user inputs
function validation(param) {
  let schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    telephone: Joi.number().min(11).required(),
    address: Joi.string().min(3).required(),
    password: Joi.string().min(6).max(12).required(),
  });
  let err = schema.validate(param);
  if (err.error) {
    return err.error.details[0].message;
  }
}

function getUsers(req, res) {
  res.sendFile(path.join(__dirname, "../views/users/index.html"));
}

const postUser = (req, res) => {
  if (validation(req.body)) {
    res.status(403).send(validation(req.body));
  } else {
    req.body.id = users.length + 1;
    console.log(req.body);
    users.push(req.body);
    res.status(200).send("The user has been registered successfully!");
  }
};

const findUser = (req, res) => {
  const user = users.find((val) => val.id === parseInt(req.params.id));
  if (!user) {
    res.status(403).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
  } else {
    res.status(200).send(user);
  }
};

const updateUser = (req, res) => {
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
};

const deleteUser = (req, res) => {
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
};
module.exports = {
  getUsers,
  postUser,
  findUser,
  updateUser,
  deleteUser,
};
