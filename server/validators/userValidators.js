const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const userValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        return user
          ? Promise.reject("Username already in use.")
          : Promise.resolve(true);
      })
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be valid email address")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        return user
          ? Promise.reject("Email already in use.")
          : Promise.resolve(true);
      })
      .trim()
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Passwords must be at least 6 characters long.")
      .trim(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
};
