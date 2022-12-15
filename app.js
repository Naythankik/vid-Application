const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 4000;

const app = express();
const vidApp = require("./route/routes");

app.use(express.json());
app.use("/users", vidApp);

app.get("/", (req, res) => res.status(200).send("This is a login display!"));

// The view for all response

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`);
});
