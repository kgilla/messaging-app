const express = require("express");
const router = express.Router();
const {
  userValidationRules,
  validate,
} = require("../validators/userValidators");
const userController = require("../controllers/userController");

router.post("/create", userValidationRules(), validate, userController.create);
router.post("/login", userController.login);

module.exports = router;
