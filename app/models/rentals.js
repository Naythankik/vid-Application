const { default: mongoose, mongo } = require("mongoose");
const uuid = require("uuid");
const rentals = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuid.v1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rentals", rentals);
