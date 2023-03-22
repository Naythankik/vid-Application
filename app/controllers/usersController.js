const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userValidation } = require("../middleware/validation");
const generateToken = require("../middleware/token");
const mail = require("./emailController");

//For admin alone
const getUsers = async (req, res) => {
  try {
    const findUser = await User.find().select(["-_id"]);
    res.status(200).send(findUser);
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const createUser = async (req, res) => {
  let { error, value } = userValidation(req.body);
  const data = {
    to: value.email,
    text: `Account has been created successfully`,
    subject: "Account Created",
    html: `Click to login: <a href="localhost:${process.env.PORT}/api/vidapp/login">Login</a>`,
  };

  if (error) {
    res.status(403).send(error.details[0].message);
    return;
  } else {
    try {
      const user = await User.create(value);
      const token = jwt.sign(
        { user: user.uuid, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      const createdUser = await User.findOneAndUpdate(
        { uuid: user.uuid },
        { token: token }
      );
      if (createdUser) {
        mail(data);
      }
      res
        .status(201)
        .send(
          "The user has been created successfully! \n check your mail inbox for Account verification"
        );
    } catch (err) {
      throw new Error(err);
    }
    return;
  }
};

const login = async (req, res) => {
  const { email } = req.body;

  //check if email is empty
  if (!email) throw new Error("No data submitted");

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(403).send({ message: "User not found" });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = generateToken(user.id);
        const { id } = user;

        await User.findByIdAndUpdate(id, {
          $set: { isActive: true, token: token },
        });

        //cookie is created so as to logout the user when the endpoint is accessed
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 86400,
        });

        res.status(200).send({ message: token });
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
  const cookie = req.cookies;

  //check if the cookie exist
  if (!cookie.token) throw new Error("No token found");

  const token = cookie.token;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(204).send({ message: "Login" });
    }

    await User.findByIdAndUpdate(user.id, {
      $set: {
        token: "",
        isActive: false,
      },
    });
    res.clearCookie("token", { httpOnly: true, secure: true });
    res.status(200).send({ message: "User has been logout successfully" });
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
  createUser,
  findUser,
  updateUser,
  deleteUser,
  login,
  logout,
};
