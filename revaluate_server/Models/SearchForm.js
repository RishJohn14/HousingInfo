const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

const schema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    town: { type: String, required: true },
    flat_type: { type: String, required: true },
    postal_code: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { collection: "transaction" }
);
schema.index({ town: 1, flat_type: 1 });

const searchForm = mongoose.model("searchForm", schema);

module.exports = searchForm;