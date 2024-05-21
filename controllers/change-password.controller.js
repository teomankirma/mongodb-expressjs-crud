const path = require("path");

const getChangePasswordPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "change-password.html"));
};

module.exports = {
  getChangePasswordPage,
};
