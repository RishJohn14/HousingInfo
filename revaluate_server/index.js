require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

const schema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    town: { type: String, required: true },
    flat_type: { type: String, required: true },
    block: { type: String, required: true },
    street_name: { type: String, required: true },
    storey_range: { type: String, required: true },
    floor_area_sqm: { type: Number, required: true },
    flat_model: { type: String, required: true },
    lease_commence_date: { type: Number, required: true },
    resale_price: { type: Number, required: true },
    remaining_lease: { type: Number, required: true },
    postal_code: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { collection: "transaction" }
);
schema.index({ town: 1, flat_type: 1 });

const model = mongoose.model("transaction", schema);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/details", async (req, res) => {
  model
    .find(
      { town: "ANG MO KIO", flat_type: "5 ROOM" },
      {
        flat_type: 1,
        floor_area_sqm: 1,
        storey_range: 1,
        resale_price: 1,
        remaining_lease: 1,
        street_name: 1,
        lease_commence_date: 1,
      }
    )
    .then((response) => {
      /* can be found */
      var price = [];
      var flat_size = 0;
      var remaining_lease = 0;
      var lease_commence_date = 0;
      var street_name = {};
      var storey_range = {};
      var length = response.length;

      for (var i = 0; i < length; i++) {
        price.push(response[i].resale_price);
        flat_size = flat_size + response[i].floor_area_sqm;
        remaining_lease = remaining_lease + response[i].remaining_lease;
        lease_commence_date =
          lease_commence_date + response[i].lease_commence_date;
        street_name[response[i].street_name] = street_name[
          response[i].street_name
        ]
          ? 0
          : street_name[response[i].street_name]++;
        storey_range[response[i].storey_range] = storey_range[
          response[i].storey_range
        ]
          ? 0
          : storey_range[response[i].storey_range]++;
      }

      price.sort();
      var most_popular_streets = Object.keys(street_name).map((street) => [
        street,
        street_name[street],
      ]);
      most_popular_streets.sort((first, second) => second[1] - first[1]);
      var most_popular_storey = Object.keys(storey_range).map((storey) => [
        storey,
        storey_range[storey],
      ]);
      most_popular_storey.sort((first, second) => second[1] - first[1]);
      const currentYear = new Date().getFullYear();
      var avg_house_age =
        currentYear - Math.floor(lease_commence_date / length);

      const result = {
        "25th_percentile_price": price[Math.floor(0.25 * (length + 1) - 1)],
        "50th_percentile_price": price[Math.floor(0.5 * (length + 1) - 1)],
        "75th_percentile_price": price[Math.floor(0.75 * (length + 1) - 1)],
        avg_flat_size: flat_size / length,
        avg_remaining_lease: remaining_lease / length,
        avg_house_age: avg_house_age,
        most_common_street: most_popular_streets.slice(0, 5),
        most_common_storey: most_popular_storey.length ? most_popular_storey[0][0] : 0,
      };
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    }); /* cannot be found */
});

app.get("/map", async (req, res) => {
  await model
    .aggregate([
      {
        $group: {
          _id: "$latitude",
          longitude: { $addToSet: "$longitude" },
        },
      },
    ])
    .then((response) => {
      /* can be found */
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    }); /* cannot be found */
});

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
  console.log(`Express server is up`);
});
