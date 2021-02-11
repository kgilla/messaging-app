const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// api/conversations/
router.post("/create", conversationController.create);
router.get("/", conversationController.read);

module.exports = router;
