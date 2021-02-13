const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// api/convos/
router.post("/", conversationController.create);
router.get("/", conversationController.read);

module.exports = router;
