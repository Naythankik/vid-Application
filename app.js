const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 2000;
const vidApp = require("./route/routes");

const app = express();

// The middlewares of the App
app.use(express.json());

app.use("/vidapp", vidApp);

app.get(["/", "/vidapp"], (req, res) => res.send("Welcome to VIDAPP!"));

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`);
});
