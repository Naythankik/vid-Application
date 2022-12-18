const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 9000;

const app = express();

// The middlewares of the App
app.use(express.urlencoded({ extended: true }));

const vidApp = require("./route/routes");
app.use("/vidapp", vidApp);

app.get(["/", "/vidapp"], (req, res) =>
  //   res.sendFile(path.join(__dirname, "public", "index.html"))
  res.send("Welcome to VIDAPP!")
);

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`);
});
