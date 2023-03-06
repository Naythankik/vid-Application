const { default: mongoose } = require("mongoose");
const uuid = require("uuid");

const movie = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuid.v1,
    },
    title: {
      type: String,
      unique: true,
      required: true,
    },
    year: Number,
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    genre: {
      type: Array,
      required: true,
    },
    ratings: Number,
    rentals: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Movies", movie);
