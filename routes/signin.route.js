const express = require("express");
const router = express.Router();
const { getSigninPage } = require("../controllers/signin.controller");

router.get("/", getSigninPage);

module.exports = router;
