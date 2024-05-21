const express = require("express");
const router = express.Router();

const {
  getChangePasswordPage,
} = require("../controllers/change-password.controller");

router.get("/", getChangePasswordPage);

module.exports = router;
