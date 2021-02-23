const Message = require("../models/Message");

exports.create = async (req, res, next) => {
  try {
    const newMessage = new Message({
      author: req.user._id,
      content: req.body.content,
      conversation: req.params.convoID,
    });
    const message = await newMessage.save();
    res.status(201).json({
      message,
    });
  } catch (err) {
    return next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    const limit = req.query.size * 1 || 50;
    const page = limit * req.query.page || 0;
    const messages = await Message.find({
      conversation: req.params.convoID,
    })
      .sort({ _id: -1 })
      .skip(page)
      .limit(limit)
      .populate("author");
    if (messages.length > 0) {
      res.status(200).json({
        messages: messages.reverse(),
      });
    } else {
      res.status(400).json({
        error: "No messages to show",
      });
    }
  } catch (err) {
    return next(err);
  }
};
