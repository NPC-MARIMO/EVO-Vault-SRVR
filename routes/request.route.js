const express = require("express");

const { sendJoinRequest } = require("../controllers/request.controller")

const router = express.Router();

router.post("/send", sendJoinRequest);

module.exports = router;
