const Message = require("../models/Message");

exports.create = async (req, res, next) => {
  try {
    const message = new Message({
      author: req.user._id,
      content: req.body.content,
      conversation: req.params.convoID,
    });
    const savedMessage = await message.save();
    res.status(201).json({
      savedMessage,
    });
  } catch (err) {
    return next(err);
  }
};

// Probably should put a limit on this and do some pagination if a user wants older messages
exports.read = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversation: req.params.convoID,
    }).sort({ dateCreated: -1 });
    res.status(200).json({
      messages,
    });
  } catch (err) {
    return next(err);
  }
};
