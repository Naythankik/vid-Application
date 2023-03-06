const { default: mongoose } = require("mongoose");

mongoose.set("strictQuery", true);

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_KEY);
    console.log("Database has been linked succesfully!");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = connection;
