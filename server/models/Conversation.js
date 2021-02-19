const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  dateCreated: { type: Date, default: Date.now },
  dateEdited: { type: Date },
});

module.exports = mongoose.model("Conversation", conversationSchema);
