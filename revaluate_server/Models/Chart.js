const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

const schema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    year: { type: Number, required: true },
    town: { type: String, required: true },
    flat_type: { type: String, required: true },
    storey_range: { type: String, required: true },
    floor_area_sqm: { type: Number, required: true },
    flat_model: { type: String, required: true },
    resale_price: { type: Number, required: true },
    remaining_lease: { type: Number, required: true },
  },
  { collection: "transaction" }
);
schema.index({ town: 1, flat_type: 1 });

const chart = mongoose.model("chart", schema);

module.exports = chart;