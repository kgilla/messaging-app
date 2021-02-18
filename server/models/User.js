const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "A username is required."],
    minLength: [3, "Username must be at least 3 characters long."],
    maxLength: [20, "Username cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "An email is required."],
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    minLength: [6, "Password must be at least 6 characters long"],
  },
  dateCreated: { type: Date, default: Date.now },
  dateEdited: { type: Date },
});

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
