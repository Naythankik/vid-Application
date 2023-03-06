const { default: mongoose } = require("mongoose");
const uuid = require("uuid");
const rentals = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuid.v1,
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    movieUuid: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rentals", rentals);
