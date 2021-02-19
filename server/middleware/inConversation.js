const Conversation = require("../models/Conversation");

const inConversation = async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.convoID);
  if (conversation.users.some((user) => user.equals(req.user._id))) {
    return next();
  } else {
    return res.status(401).json({
      message: "You are not part of this conversation",
    });
  }
};

module.exports = {
  inConversation,
};
