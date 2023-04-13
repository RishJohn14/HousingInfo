require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);
const comment = require("./Comment");
const user = require("./User");

const schema = new mongoose.Schema(
  {
    _id: { type: Number },
    user: { type: user, required: true },
    timestamp: { type: Date, required: true },
    title: { type: String, required: true },
    post: { type: String, required: true },
    topics: { type: [String], required: true },
    comments: { type: [comment] }
  },
  { collection: "forumPosts" }
);

const discussion = mongoose.model("forumPosts", schema);

module.exports = discussion;