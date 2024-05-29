const path = require("path");
const User = require("../models/user.model");

const getNewReservationPage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "new-reservation.html"));
};

const addReservation = async (req, res) => {
  const {
    userId,
    ticketType,
    date,
    people,
    price,
    saveCard,
    cardName,
    cardNumber,
    expiryMonth,
    expiryYear,
    securityCode,
  } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    user.reservations.push({ ticketType, date, people, price });

    // If saveCard is true, save the credit card information
    if (saveCard) {
      user.savedCreditCards.push({
        cardName,
        cardNumber,
        expiryMonth,
        expiryYear,
        securityCode,
      });
    }

    try {
      await user.save();
      const createdReservation =
        user.reservations[user.reservations.length - 1];

      res.status(201).send({
        _id: createdReservation._id,
        ticketType: createdReservation.ticketType,
        date: createdReservation.date,
        people: createdReservation.people,
        price: createdReservation.price,
      });
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
