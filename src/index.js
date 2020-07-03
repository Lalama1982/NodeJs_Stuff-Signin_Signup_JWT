require("./models/User");
/**
 * "User" model is not assigned to any variable
 * If assigned to a variable, "mongoose.model('User', userSchema);" will be executed multiple times
 *   for new user instance
 * It is like a "One-Time" procedure
 * Only executed once when the "index.js" is rendered.
 * Neither "models/User" returns any
 */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(bodyParser.json()); // Parsing "body" properties to json

app.use(authRoutes);

const mongoUri =
  "mongodb+srv://admin:passwordpwd@cluster0.g2aos.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to Cloud Mongo Instance");
});
mongoose.connection.on("error", (err) => {
  console.error("Error Connecting to Cloud Mongo Instance", err);
});

app.get("/", requireAuth, (req, res) => {
  res.status(200).send({
    location: "Receiving from..... index.js(/) : 01",
    detail: '"SignIn/SignUp" is running!',
    email: `${req.user.email}`,
  });
});

app.listen(3015, () => {
  console.log('"SignIn/SignUp" Listening on port 3015');
});
