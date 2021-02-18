const User = require("../models/User");
const Conversation = require("../models/Conversation");
const { convoQuery } = require("../helpers/queries");

exports.create = async (req, res, next) => {
  try {
    const oldConversation = await Conversation.find({
      users: { $all: [req.body.recipient, req.user._id] },
    });
    if (oldConversation.length > 0) {
      return res.status(400).json({
        message: "Conversation alreay exists",
      });
    }
    const recipient = await User.findById(req.body.recipient);
    const conversation = new Conversation({
      users: [req.user._id, recipient],
    });
    await conversation.save();
    return res.status(201).json({
      conversation,
    });
  } catch (err) {
    return next(err);
  }
};

// grabs all conversations from auth user, populates the users, and grabs the most recent message and populates the author
exports.read = async (req, res, next) => {
  try {
    console.log(convoQuery(req.user._id));
    const data = await Conversation.aggregate(convoQuery(req.user._id));
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
};
