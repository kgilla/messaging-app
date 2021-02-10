const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: {
    type: String,
  },
  dateCreated: { type: Date, default: new Date() },
  dateEdited: { type: Date },
  conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
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
