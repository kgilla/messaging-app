const express = require("express");
const router = express.Router({ mergeParams: true });
const messageController = require("../controllers/messageController");

// api/conversations/:convoID/messages
router.post("/create", messageController.create);
router.get("/", messageController.read);

module.exports = router;
