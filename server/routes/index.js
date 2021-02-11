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
