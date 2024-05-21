const User = require("../models/signup.model");
const path = require("path");

const getSignupPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "signup.html"));
};

module.exports = {
  getSignupPage,
};
