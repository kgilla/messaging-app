const mongoose = require("mongoose");

const convoQuery = (userID) => {
  return [
    { $match: { users: mongoose.Types.ObjectId(userID) } },
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
          { $sort: { _id: -1 } },
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
  ];
};

module.exports = {
  convoQuery,
};
