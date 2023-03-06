const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const user = new mongoose.Schema(
  {
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
    address: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

user.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", user);
