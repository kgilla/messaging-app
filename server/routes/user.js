const express = require("express");
const router = express.Router();
const {
  userValidationRules,
  validate,
} = require("../validators/userValidators");
const userController = require("../controllers/userController");
const passport = require("passport");

// api/users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.read
);

router.post("/create", userValidationRules(), validate, userController.create);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  userController.login
);

router.post("/logout", userController.logout);

module.exports = router;
