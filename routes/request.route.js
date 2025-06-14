const express = require("express");

const { sendJoinRequest, getAllJoinRequests } = require("../controllers/request.controller")

const router = express.Router();

router.post("/send", sendJoinRequest);
router.get("/get-req/:email", getAllJoinRequests);

module.exports = router;
