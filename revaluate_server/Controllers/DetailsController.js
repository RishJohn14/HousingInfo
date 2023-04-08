/*
* Details Controller
*/

//import models
const houseData = require("../Models/HouseData");

/**
 * function to perform aggregation and filtering based on search filters and return search results
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
async function getDetails(req, res) {
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
};

/**
 * function that uses a series of logic to provide recommendations based on search filters
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
function getAdvice(req, res) {
    const reqData = req?.query;
    const minValue = reqData?.minValue;
    const maxValue = reqData?.maxValue;
    const workplaceLocation = reqData?.workplaceLocation;
    const householdPax = reqData?.householdPax;

    if (!(minValue && maxValue && workplaceLocation && householdPax)) {res.send({ 'status': 'error' }); return;}

    var suitableFlatType;
    if (householdPax <= 2) {
      suitableFlatType = ['1 ROOM', '2 ROOM', '3 ROOM']
    }
    else if (householdPax <= 3) {
      suitableFlatType = ['3 ROOM', '4 ROOM']
    }
    else if (householdPax <= 6) {
      suitableFlatType = ['4 ROOM', '5 ROOM', 'EXECUTIVE']
    }
    else {
      suitableFlatType = ['5 ROOM', 'EXECUTIVE', 'MULTI-GENERATIONAL']
    }

    var neighbourhoods;
    if (workplaceLocation === 'North') {
      neighbourhoods = ['ANG MO KIO', 'BISHAN', 'BUKIT BATOK', 'CHOA CHU KANG', 'SEMBAWANG', 'WOODLANDS', 'YISHUN']
    }
    else if (workplaceLocation === 'East') {
      neighbourhoods = ['BEDOK', 'KALLANG/WHAMPOA', 'MARINE PARADE', 'PASIR RIS', 'PUNGGOL', 'TAMPINES', 'SENGKANG',]
    }
    else if (workplaceLocation === 'West') {
      neighbourhoods = ['BUKIT BATOK', 'CHOA CHU KANG', 'BUKIT PANJANG', 'BUKIT TIMAH', 'JURONG EAST', 'JURONG WEST', 'CLEMENTI']
    }
    else {
      neighbourhoods = ['ANG MO KIO', 'BISHAN', 'BUKIT MERAH', 'CENTRAL AREA', 'GEYLANG', 'HOUGANG', 'QUEENSTOWN', 'SERANGOON', 'TOA PAYOH', 'KALLANG/WHAMPOA', 'BUKIT TIMAH']
    }

    houseData.aggregate([
      { $match: { $and: [
        {'town': {$in: neighbourhoods}},
        {'flat_type': {$in: suitableFlatType} },
        {'resale_price': {$gte: Number(minValue), $lte: Number(maxValue)}}
      ]}},
      { $group: {
          _id: '$town',
          avgPrice: { $avg: '$resale_price' },
      }}
    ])
    .then((response) => {
      if (response.length <= 0) {res.send({ 'status': 'here' }); return;}
      response.sort((a,b) => {
        if (a.avgPrice > b.avgPrice) {return 1;}
        else {return -1;}
      });
      const suitableTown = response[0]?._id;
      houseData.aggregate([
        { $match: { $and: [
          {'town': suitableTown},
          {'flat_type': {$in: suitableFlatType} },
        ]}},
        { $group: {
            _id: '$flat_type',
            avgPrice: { $avg: '$resale_price' },
            avgSize: { $avg: '$floor_area_sqm' }
        }}
      ])
      .then((response) => {
        res.send({'town': suitableTown, 'data': response});
      })
      .catch((err) => res.send({ 'status': 'error' }))
    })
    .catch((err) => res.send({ 'status': 'error' }))
};

module.exports = {
    getDetails,
    getAdvice
}