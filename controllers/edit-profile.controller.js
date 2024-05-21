const path = require("path");

const getEditProfilePage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "edit-profile.html"));
};

module.exports = {
  getEditProfilePage,
};
