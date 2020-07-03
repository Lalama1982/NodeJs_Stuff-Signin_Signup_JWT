const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY"); // Payload: "userId"

    res.send({
      message: "Sign-up Successful!",
      token,
      location: "Receiving from..... authRoutes(/signup): POST : 01",
    });
  } catch (err) {
    //return res.status(422).send(err.message);
    res.status(422).send({
      error: err.message,
      location: "Receiving from..... authRoutes(/signup): POST : 02",
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).send({
      error: "Null Email or Password",
      location: "Receiving from..... authRoutes(/signin): POST: 01",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).send({
      error: "Email not found",
      location: "Receiving from..... authRoutes(/signin): POST: 02",
    });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.status(200).send({
      message: "Sign-in Successful!",
      token,
      user: user.email,
      location: "Receiving from..... authRoutes(/signin): POST : 03",

    });
  } catch (err) {
    res.status(422).send({
      error: "Invalid Email or Password",
      errorInDetail: err.message,
      location: "Receiving from..... authRoutes(/signin): POST: 04",
    });
  }
});

module.exports = router;