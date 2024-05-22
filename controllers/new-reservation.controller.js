const path = require("path");

const getNewReservationPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "new-reservation.html"));
};

module.exports = {
  getNewReservationPage,
};
