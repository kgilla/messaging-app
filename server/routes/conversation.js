const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// api/convos/
router.post("/", conversationController.create);
router.get("/", conversationController.read);
router.get("/test", conversationController.test);

module.exports = router;
