const user = require("./User");

const Comment = {
  user: { type: user, required: true },
  timestamp: { type: Date, required: true },
  content: { type: String, required: true}
}

module.exports = Comment;