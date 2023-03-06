const User = require("../models/users");
const bcrypt = require("bcrypt");
const { userValidation } = require("../middleware/validation");

const getUsers = async (req, res) => {
  const findUser = await User.find();
  res.status(200).send(findUser);
  return;
};

const postUser = async (req, res) => {
  let { error, value } = userValidation(req.body);

  if (error) {
    res.status(403).send(error.details[0].message);
    return;
  } else {
    try {
      await User.create(value);
      res.status(200).send("The user has been registered successfully!");
    } catch (err) {
      res.status(400).send(err.keyValue);
    }
    return;
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(403).send({ message: "User not found" });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        await User.updateOne({ _id: user.id }, { isActive: true });
        res.status(200).send({ message: "User is active" });
      } else {
        res.status(403).send({ message: "User password is wrong" });
      }
    }
  } catch (err) {
    throw new Error(err);
  }
  return;
};

const logout = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.isActive) {
      await User.updateOne({ _id: user.id }, { isActive: false });
      res.status(200).send({ message: "User has been logout successfully" });
    }
  } catch (err) {
    res.status(403).send({ error: err.message });
  }
  return;
};

const findUser = async (req, res) => {
  const user = await User.findById(req.params.id);
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

const updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);

  if (!updatedUser) {
    res.status(403).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
    return;
  } else {
    res.status(200).send({
      message: `The user has been updated!`,
    });
    return;
  }
};

const deleteUser = async (req, res) => {
  const del = await User.findByIdAndDelete(req.params.id);

  if (!del) {
    res.status(403).send({
      warning: `The user with the id, ${req.params.id} is not found`,
    });
    return;
  } else {
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
  login,
  logout,
};
