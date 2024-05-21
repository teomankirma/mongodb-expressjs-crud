const express = require("express");
const router = express.Router();
const { getSignupPage } = require("../controllers/signup.controller");

router.get("/", getSignupPage);

module.exports = router;
