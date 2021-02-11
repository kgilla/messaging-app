const express = require("express");
const router = express.Router();
const passport = require("passport");

router.use("/users", require("./user"));

router.use(
  "/conversations",
  passport.authenticate("jwt", { session: false }),
  require("./conversation")
);

router.use(
  "/conversations/:convoID/messages",
  passport.authenticate("jwt", { session: false }),
  require("./message")
);

module.exports = router;

// a way to store conversations and messages
// an API call to get all conversations for a user
// an API call to get all messages for a conversation (ordered in a way that makes sense)
// an API to search for users to find them to talk to
