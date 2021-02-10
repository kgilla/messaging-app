const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "A username is required."],
    minLength: [2, "Username must be at least 2 characters long."],
    maxLength: [32, "Username cannot exceed 32 characters"],
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
  dateCreated: { type: Date, default: new Date() },
  dateEdited: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
