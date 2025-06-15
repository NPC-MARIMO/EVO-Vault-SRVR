const express = require("express");

const { sendJoinRequest, getAllJoinRequests, updateRequest } = require("../controllers/request.controller")

const router = express.Router();

router.post("/send", sendJoinRequest);
router.get("/get-req/:email", getAllJoinRequests);
router.put("/update/:email", updateRequest);

module.exports = router;
