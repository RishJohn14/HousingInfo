/*
 * Import dependencies
 */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const tc = require("title-case");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

/*
 * Server initialisation
 */
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`Express server is up`);
});

/*
 * Models
 */
const houseData = require("./Models/HouseData");
const chart = require("./Models/Chart");
const infoCard = require("./Models/InfoCard");
const map = require("./Models/Map");
const pin = require("./Models/Pin");
const searchForm = require("./Models/SearchForm");

/*
 * Controllers
 */
app.get("/", (req, res) => {
  console.log(req.query);
  res.send("Welcome to REvaluate Server");
});

app.get('/getTransactionsFromPin', (req, res) => {
  const reqData = req.query;
  houseData.find({$and: [
    {latitude: reqData?.latitude},
    {longitude: reqData?.longitude},
    {flat_type: reqData?.flat_type},
  ]})
  .then((response) => {
    res.send({'status': 'success', 'data': response});
  })
  .catch((err) => res.send({'status': 'error'}))
})

app.get("/neighbourhoodAffordability", (req, res) => {
  houseData.aggregate([
    { $group: {
        _id: '$town',
        avgPrice: { $avg: '$resale_price' }
    }}
  ])
  .then((response) => {
    //sort by price
    response.sort((a,b) => {
      if (a.avgPrice > b.avgPrice) {return 1;}
      else {return -1;}
    })
    const mostValued = response.slice(-5);
    const mostAffordable = response.slice(0,5);

    res.send({
      'status': 'success',
      mostValued,
      mostAffordable,
    });
  })
  .catch((err) => res.send({ 'status': 'error' }))
});

app.get("/flatStatsByType", (req, res) => {
  houseData.aggregate([
    { $group: {
        _id: '$flat_type',
        avgPrice: { $avg: '$resale_price' },
        avgTenure: { $avg: '$remaining_lease' },
        avgSize: { $avg: '$floor_area_sqm' }
    }}
  ])
  .then((response) => {
    //sort by price
    response.sort((a,b) => {
      if (a.avgPrice > b.avgPrice) {return 1;}
      else {return -1;}
    });

    res.send({
      'status': 'success',
      'data': response,
    });
  })
  .catch((err) => res.send({ 'status': 'error' }))
});

//form validation manager
app.get("/validateform", async (req, res) => {
  const reqData = req.query;
  const userType = reqData?.type;

  // user type missing
  if (!userType) {
    res.send('Invalid form');
  }

  // user type is buyer
  if (userType === "buyer") {
    if (reqData?.buyerNeighbourhood != "" && req?.buyerHouseType != "") {
      res.send({
        ...reqData,
        status: "success",
      });
    } else {
      res.send({
        status: "Invalid Housing District or Neighbourhood or House Type",
      });
    }
  }

  // user type is seller
  if (userType === "seller") {
    if (reqData?.sellerPostalCode != "" && reqData?.sellerHouseType != "") {
      //make api call to get location data based on postal code
      const apiLink =
        'https://developers.onemap.sg/commonapi/search?searchVal="' +
        reqData.sellerPostalCode +
        '"&returnGeom=Y&getAddrDetails=Y&pageNum={1}';
      const apiResponse = await (await fetch(apiLink)).json();

      //invalid postal code
      if (apiResponse.found == 0) {
        res.send({ status: "Invalid Postal Code" });
      }
      console.log(apiResponse);

      //valid postal code
      const response = {
        ...reqData,
        status: "success",
        road_name: tc.titleCase(apiResponse.results[0].ROAD_NAME.toLowerCase()),
        latitude: Number(apiResponse.results[0].LATITUDE),
        longitude: Number(apiResponse.results[0].LONGITUDE),
      };
      res.send(response);
    } else {
      res.send({ status: "Invalid Postal Code or House Type" });
    }
  }
});

app.get("/generalPricingChart", (req, res) => {
  //get time frame (past 10 years)
  const currentYear = new Date().getFullYear();
  var timeFrame = [];
  for (var i = 0; i < 10; i++) { timeFrame.push(currentYear - i); }

  //entire Singapore
  houseData.aggregate([
    { $match: {'year': {$gte: timeFrame[9], $lte: timeFrame[0]}}},
    { $group: {
        _id: '$year',
        avgPrice: { $avg: '$resale_price' }
    }}
  ])
  .then((response) => {
    var singaporeData = response;
    singaporeData.sort((a,b) => {
      if (a._id > b._id) {return 1;}
      else {return -1;}
    });

    res.send({
      'status': 'success',
      singaporeData
  });
  })
  .catch((err) => res.send({'status': 'error'}));
});

//chart manager
app.get("/neighbourhoodPriceComparisonChart", (req, res) => {
  const reqData = req.query;
  const userType = reqData?.type;
  var singaporeData;
  var neighbourhoodData;
  console.log(reqData);

  //get time frame (past 10 years)
  const currentYear = new Date().getFullYear();
  var timeFrame = [];
  for (var i = 0; i < 10; i++) { timeFrame.push(currentYear - i); }

  //missing user type information
  if (!userType) { res.send({ 'status': 'Missing Information' }); }
  //entire Singapore
  houseData.aggregate([
    { $match: { $and: [
      {'year': {$gte: timeFrame[9], $lte: timeFrame[0]}},
      {'flat_type': reqData.flat_type }
    ]}},
    { $group: {
        _id: '$year',
        avgPrice: { $avg: '$resale_price' }
    }}
  ])
  .then((response) => {
    singaporeData = response;
    singaporeData.sort((a,b) => {
      if (a._id > b._id) {return 1;}
      else {return -1;}
    });

    //user is a buyer
    if (userType === 'buyer') {
      houseData.aggregate([
        { $match: { $and: [
          {'year': {$gte: timeFrame[9], $lte: timeFrame[0]}},
          {'flat_type': reqData.flat_type },
          {'town': reqData.town }
        ]}},
        { $group: {
            _id: '$year',
            avgPrice: { $avg: '$resale_price' }
        }}
      ])
      .then((response) => {
        neighbourhoodData = response;
        neighbourhoodData.sort((a,b) => {
          if (a._id > b._id) {return 1;}
          else {return -1;}
        });

        res.send({
          'status': 'success',
          singaporeData,
          neighbourhoodData,
        });
      })
      .catch((err) => console.log(err))
    } else { //user is a seller
      houseData.aggregate([
        { $match: { $and: [
          {'year': {$gte: timeFrame[9], $lte: timeFrame[0]}},
          {'flat_type': reqData.flat_type },
          {'latitude': {$gte: Number(reqData.latitude) - 0.02, $lte: Number(reqData.latitude) + 0.02}},
          {'longitude': {$gte: Number(reqData.longitude) - 0.02, $lte: Number(reqData.longitude) + 0.02}}
        ]}},
        { $group: {
            _id: '$year',
            avgPrice: { $avg: '$resale_price' }
        }}
      ])
      .then((response) => {
        neighbourhoodData = response;
        neighbourhoodData.sort((a,b) => {
          if (a._id > b._id) {return 1;}
          else {return -1;}
        });

        var xAxis = [];
        singaporeData.map((data) => xAxis.push(data._id));

        res.send({
          'status': 'success',
          singaporeData,
          neighbourhoodData,
          xAxis,
        });
    })
      .catch((err) => console.log(err))
    }
  })
  .catch((err) => console.log(err));
});

//details manager
app.get("/details", async (req, res) => {
  const reqData = req.query;
  const userType = reqData.type;

  if (userType === 'buyer') {
    houseData
    .find(
      { town: reqData.buyerNeighbourhood.toUpperCase(), flat_type: reqData.buyerHouseType },
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
        lease_commence_date = lease_commence_date + response[i].lease_commence_date;
        street_name[response[i].street_name] = street_name[response[i].street_name]
          ? 0
          : street_name[response[i].street_name]++;
        storey_range[response[i].storey_range] = storey_range[response[i].storey_range]
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
      var avg_house_age = currentYear - Math.floor(lease_commence_date / length);

      const result = {
        "25th_percentile_price": price[Math.floor(0.25 * (length + 1) - 1)],
        "50th_percentile_price": price[Math.floor(0.5 * (length + 1) - 1)],
        "75th_percentile_price": price[Math.floor(0.75 * (length + 1) - 1)],
        avg_flat_size: flat_size / length,
        avg_remaining_lease: remaining_lease / length,
        avg_house_age: avg_house_age,
        most_common_street: most_popular_streets.slice(0, 5),
        most_common_storey: most_popular_storey.length
          ? most_popular_storey[0][0]
          : 0,
      };
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    }); /* cannot be found */
  } else {
    houseData
    .find(
      { latitude: { $gte: Number(reqData.latitude) - 0.02, $lte: Number(reqData.longitude) + 0.02 },
        longitude: { $gte: Number(reqData.longitude) - 0.02, $lte: Number(reqData.longitude) + 0.02 },
        flat_type: reqData.sellerHouseType },
      {
        flat_type: 1,
        floor_area_sqm: 1,
        storey_range: 1,
        resale_price: 1,
        remaining_lease: 1,
        street_name: 1,
        lease_commence_date: 1,
        year: 1,
        month: 1,
      }
    )
    .then((response) => {
      /* can be found */
      var price = [];
      var flat_size = 0;
      var remaining_lease = 0;
      var lease_commence_date = 0;
      var length = response.length;

      for (var i = 0; i < length; i++) {
        price.push(response[i].resale_price);
        flat_size = flat_size + response[i].floor_area_sqm;
        remaining_lease = remaining_lease + response[i].remaining_lease;
        lease_commence_date = lease_commence_date + response[i].lease_commence_date;
      }

      response.sort(function(x, y) {
        if (x.year > y.year) {return -1}
        else if (x.year < y.year) {return 1}
        else {
          if (x.month > y.month) {return -1}
          else if (x.month < y.month) {return 1}
          else {return 0}
        }
      });
      price.sort();
      const currentYear = new Date().getFullYear();
      var avg_house_age = currentYear - Math.floor(lease_commence_date / length);

      const result = {
        "25th_percentile_price": price[Math.floor(0.25 * (length + 1) - 1)],
        "50th_percentile_price": price[Math.floor(0.5 * (length + 1) - 1)],
        "75th_percentile_price": price[Math.floor(0.75 * (length + 1) - 1)],
        avg_flat_size: flat_size / length,
        avg_remaining_lease: remaining_lease / length,
        avg_house_age: avg_house_age,
        transactions: response.slice(0,5),
      };
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    }); /* cannot be found */
  }
});

//map manager
app.get("/map", async (req, res) => {
    houseData
      .aggregate([
        {
          $match: { $and: [
            //same house type
            {flat_type: req.query.houseType},

            //fit within price range
            {resale_price: {$gte: Math.min(req.query?.minPrice, 0), $lte: Math.min(req.query?.maxPrice, 9999999)}}
          ]}
        },
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
