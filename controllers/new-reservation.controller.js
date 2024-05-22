const path = require("path");
const User = require("../models/user.model");

const getNewReservationPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "new-reservation.html"));
};

const addReservation = async (req, res) => {
  const { userId, place, date, people } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user.reservations.push({ place, date, people });

    try {
      await user.save();
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getNewReservationPage,
  addReservation,
};
