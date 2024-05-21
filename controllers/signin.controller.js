const path = require("path");

const getSigninPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "signin.html"));
};

module.exports = {
  getSigninPage,
};
