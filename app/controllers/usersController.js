const User = require("../models/users");
const bcrypt = require("bcrypt");
const { userValidation } = require("../middleware/validation");
const generateToken = require("../middleware/token");
const mail = require("./emailController");
const crypto = require("crypto");

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

  //   Mailing data
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

      if (user) mail(data);

      res
        .status(201)
        .send(
          "The user has been created successfully!!! \n check your mail inbox for Account verification"
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

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });

  if (!findUser) throw new Error("Email not found");

  //set a token to reset the password
  try {
    const token = crypto.randomBytes(32).toString("hex");
    findUser.passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    findUser.passwordExpires = Date.now() + 30 * 60 * 1000;

    await findUser.save();

    const data = {
      to: email,
      text: `Click the link to reset password`,
      subject: "Password Reset",
      html: `<a href="localhost:5000/api/vidapp/resetPassword/${token}">RESET PASSWORD</a>`,
    };
    mail(data);
    res
      .status(200)
      .send({ message: "A reset password link has been sent to your email" });
    return;
  } catch (error) {
    throw new Error(error);
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  //check if the password is given
  if (!password) throw new Error("password is empty");

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const findUser = await User.findOne({
      passwordResetToken: hashToken,
      passwordExpires: { $gte: Date.now() },
    });

    //if findUser returns null
    if (!findUser) throw new Error("Reset token has expired, try again");

    findUser.password = password;
    findUser.passwordExpires = undefined;
    findUser.passwordResetToken = undefined;
    await findUser.save();

    mail({
      to: findUser.email,
      subject: "Password Reset Successfully",
      text: "Password has been reset succcesfully",
      html: `<a href="localhost:5000/api/vidapp/login>Login</a>`,
    });

    res.status(201).send({ message: "Password has been reset successfully" });
  } catch (error) {
    throw new Error(error);
  }

  //   check if the token exist
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
  forgetPassword,
  resetPassword,
};
