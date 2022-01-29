const { Schema } = require("mongoose");
const CommentSchema = require("./Comment");

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    comments: [CommentSchema],
  },
  { timestamps: true },
);

module.exports = postSchema;
