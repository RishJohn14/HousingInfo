const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

const schema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { collection: "transaction" }
);
schema.index({ town: 1, flat_type: 1 });

const pin = mongoose.model("pin", schema);

module.exports = pin;