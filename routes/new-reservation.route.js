const express = require("express");
const router = express.Router();

const {
  getNewReservationPage,
} = require("../controllers/new-reservation.controller");

router.get("/", getNewReservationPage);

module.exports = router;
