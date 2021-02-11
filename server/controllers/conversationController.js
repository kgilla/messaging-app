const User = require("../models/User");
const Conversation = require("../models/Conversation");

// could refactor into an update call with upsert option to facilitate adding new users to existing conversations and or creating documents in one call.

exports.create = async (req, res, next) => {
  try {
    // check if conversation already exists to avoid duplication
    const oldConversation = await Conversation.find({
      users: { $all: [req.body.recipient, req.user._id] },
    });
    if (oldConversation) {
      return res.status(400).json({
        message: "Conversation alreay exists",
      });
    } else {
      const recipient = await User.findById(req.body.recipient);
      const conversation = new Conversation({
        users: [req.user._id, recipient],
      });
      await conversation.save();
    }
    return res.status(201).json({
      conversation,
    });
  } catch (err) {
    return next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ users: req.user._id });
    res.json({
      conversations,
    });
  } catch (err) {
    return next(err);
  }
};
