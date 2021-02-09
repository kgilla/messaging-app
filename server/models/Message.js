const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
  dateCreated: { type: Date, default: new Date() },
  dateEdited: { type: Date },
});

module.exports = mongoose.model("Message", messageSchema);
