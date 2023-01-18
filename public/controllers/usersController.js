const users = require("../models/users");
const path = require("path");
const Joi = require("joi");

// The default schema for joi
const schema = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
  telephone: Joi.number().min(11).required(),
  address: Joi.string().min(3).required(),
  password: Joi.string().min(6).max(12).required(),
});

// The validation for user inputs
function validation(param) {
  return schema.validate(param);
}

const getUsers = (req, res) => {
  res.status(200).send(users);
  return;
};

const postUser = (req, res) => {
  let { error, value } = validation(req.body);

  if (error) {
    res.status(403).send(error.details[0].message);
    return;
  } else {
    value.id = users.length + 1;
    users.push(value);
    res.status(200).send("The user has been registered successfully!");
    return;
  }
};

const findUser = (req, res) => {
  const user = users.find((val) => val.id === parseInt(req.params.id));
  if (!user) {
    res.status(403).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
    return;
  } else {
    res.status(200).send(user);
    return;
  }
};

const updateUser = (req, res) => {
  const updUser = users.find((val) => val.id === parseInt(req.params.id));

  if (!updUser) {
    res.status(403).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
    return;
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

    return;
  }
};

const deleteUser = (req, res) => {
  const del = users.findIndex((val) => val.id === parseInt(req.params.id));

  if (del < 0) {
    res.status(403).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
    return;
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
