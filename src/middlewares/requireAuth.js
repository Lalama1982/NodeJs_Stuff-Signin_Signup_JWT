const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // This is to work, in the reques, jwt should be added as a header {Authorization: Bearer <jwt>}
  // Header names are lower cased in receiving
  const { authorization } = req.headers; // Format: Bearer <jwt>

  if (!authorization) {
    return res.status(401).send({
      location: "Receiving from..... /requireAuth.js:01",
      error: "You must be logged in.",
      detail: "No Authorization value",
    });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({
        location: "Receiving from..... /requireAuth.js:02",
        error: "You must be logged in.",
        detail: "Error in 'jwt.verify'",
      });
    }

    const { userId } = payload;
    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};
