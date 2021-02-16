const User = require("../models/User");
const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");

exports.create = async (req, res, next) => {
  try {
    const oldConversation = await Conversation.find({
      users: { $all: [req.body.recipient, req.user._id] },
    });
    if (oldConversation.length < 1) {
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
    const data = await Conversation.aggregate([
      { $match: { users: mongoose.Types.ObjectId(req.user._id) } },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "messages",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$conversation"] },
              },
            },
            { $sort: { dateCreated: -1 } },
            { $limit: 1 },
            {
              $lookup: {
                from: "users",
                let: { id: "$author" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] },
                    },
                  },
                ],
                as: "author",
              },
            },
          ],
          as: "messages",
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
};
