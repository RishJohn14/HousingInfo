const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

const schema = new mongoose.Schema(
  {
    _id: { type: Object, required: true },
    topic: { type: String, required: true },
    colour: { type: String, required: true },
  },
  { collection: "forumTopics" }
);
schema.index({ town: 1, flat_type: 1 });

const forumTopics = mongoose.model("forumTopics", schema);

module.exports = forumTopics;