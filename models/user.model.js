const mongoose = require("mongoose");

const ReservationsSchema = mongoose.Schema({
  ticketType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  people: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  reservations: {
    type: [ReservationsSchema],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
