const express = require("express");
const router = express.Router();

const {
  getEditProfilePage,
} = require("../controllers/edit-profile.controller");

router.get("/", getEditProfilePage);

module.exports = router;
