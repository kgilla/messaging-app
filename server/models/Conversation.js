const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dateCreated: { type: Date, default: new Date() },
  dateEdited: { type: Date },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Conversation", conversationSchema);
