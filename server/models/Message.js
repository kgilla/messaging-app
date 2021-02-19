const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    index: true,
  },
  dateCreated: { type: Date, default: Date.now },
  dateEdited: { type: Date },
});

module.exports = mongoose.model("Message", messageSchema);
