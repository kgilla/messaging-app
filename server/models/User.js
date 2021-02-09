const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  dateCreated: { type: Date, default: new Date() },
  dateEdited: { type: Date },
  conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
});

module.exports = mongoose.model("User", userSchema);
