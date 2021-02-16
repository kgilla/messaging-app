const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.create = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({
      username,
      email,
      password,
    });
    const response = await user.save();
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    return res.status(201).cookie("token", token, { httpOnly: true }).json({
      user: response,
      message: "Saved successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    const query = req.query.user;
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    });
    return res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
};

exports.login = (req, res, next) => {
  try {
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET);
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ user: req.user, token });
  } catch (err) {
    return next(err);
  }
};

exports.logout = (req, res, next) => {
  try {
    return res.status(200).clearCookie("token");
  } catch (err) {
    return next(err);
  }
};

exports.reAuth = async (req, res, next) => {
  try {
    console.log("here");
    console.log(req.user);
    return res.status(200).json({ user: req.user });
  } catch (err) {
    return next(err);
  }
};
