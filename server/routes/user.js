const express = require("express");
const router = express.Router();
const { userValidationRules, validate } = require("../middleware/validators");
const userController = require("../controllers/userController");
const passport = require("passport");
const { requireSignin } = require("../middleware/requireSignin");

// api/users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.read
);

router.post("/", userValidationRules(), validate, userController.create);

router.post("/login", requireSignin, userController.login);

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  userController.logout
);

router.get(
  "/reAuth",
  passport.authenticate("jwt", { session: false }),
  userController.reAuth
);

module.exports = router;
