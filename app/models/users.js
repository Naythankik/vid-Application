const { default: mongoose } = require("mongoose");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const user = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuid.v1,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telephone: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    address: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    passwordResetToken: String,
    passwordExpires: Date,
  },
  { timestamps: true }
);

user.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", user);
