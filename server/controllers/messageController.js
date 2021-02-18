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
    const page = 10 * req.query.page;
    const messages = await Message.find({
      conversation: req.params.convoID,
    })
      .sort({ _id: -1 })
      .skip(page)
      .limit(20)
      .populate("author");
    res.status(200).json({
      messages: messages.reverse(),
    });
  } catch (err) {
    return next(err);
  }
};
