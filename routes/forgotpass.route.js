const express = require("express");
const { forgotPass } = require("../controllers/forgotPass.controller");

const router = express.Router();

router.post("/send-mail", forgotPass);

module.exports = router;
