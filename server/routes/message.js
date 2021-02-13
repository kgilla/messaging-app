const express = require("express");
const router = express.Router({ mergeParams: true });
const messageController = require("../controllers/messageController");
const { inConversation } = require("../middleware/inConversation");
const {
  messageValidationRules,
  validate,
} = require("../middleware/validators");

// api/convos/:convoID/messages
router.post(
  "/",
  messageValidationRules(),
  validate,
  inConversation,
  messageController.create
);
router.get("/", inConversation, messageController.read);

module.exports = router;
