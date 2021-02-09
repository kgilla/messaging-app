const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

exports.create = [
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
    .isLength({ min: 8, max: 60 })
    .withMessage("Passwords must be at least 8 characters long.")
    .trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username: username,
        email,
        password: hashedPassword,
      });
      const response = await user.save();
      res.status(201).json({
        user: response,
        message: "Saved successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.login = [
  body("username").trim().trim(),
  body("password").trim(),
  (req, res) => {
    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        if (err) {
          res.status(400).json({
            message: info.message,
            err,
            name: info.name,
          });
        } else if (!user) {
          return res.status(401).json({
            user,
            message: info.message,
            name: info.name,
          });
        } else {
          const token = jwt.sign({ user }, process.env.JWT_SECRET);
          return res.status(200).json({ user, token });
        }
      }
    )(req, res);
  },
];
