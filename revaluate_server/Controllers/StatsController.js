/*
* Stats Controller
*/

const calCorrelation = require("calculate-correlation");

//import models
const houseData = require("../Models/HouseData");

/**
 * function to get statistics of by house type
 * @param {*} req 
 * @param {*} res 
 */
function getFlatStatsByType(req, res) {
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
};

/**
 * function to get statistics of a particular neighbourhood
 * @param {*} req 
 * @param {*} res 
 */
function getNeighbourhoodStatistics(req, res) {
    const reqData = req.query;
    if (reqData?.town === '') {return;}

    houseData.aggregate([
      { $match: {'town': reqData.town }},
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
};

/**
 * function to get correlation coefficient between the different features and resale price
 * @param {*} req 
 * @param {*} res 
 */
function getCorrelation(req, res) {
    const reqData = req.query;

    const userType = reqData.type;
    var findQuery = {};

    if (userType === 'buyer') {
      findQuery = {
        town: reqData.buyerNeighbourhood.toUpperCase(),
        flat_type: reqData.buyerHouseType };
    }
    else if (userType === 'seller') {
      findQuery = {
        latitude: { $gte: Number(reqData.latitude) - 0.02, $lte: Number(reqData.longitude) + 0.02 },
        longitude: { $gte: Number(reqData.longitude) - 0.02, $lte: Number(reqData.longitude) + 0.02 },
        flat_type: reqData.sellerHouseType };
    }
    houseData.find(findQuery,
      {year: 1, storey_range: 1, floor_area_sqm: 1, resale_price: 1, remaining_lease: 1}
    )
    .then((response) => {
      var yearArr = [];
      var storey_rangeArr = [];
      var sizeArr = [];
      var priceArr = [];
      var leaseArr = [];
      const storey_rangeMapping = {
        '01 TO 03': 1,
        '01 TO 05': 1,
        '04 TO 06': 1.5,
        '07 TO 09': 2,
        '06 TO 10': 2,
        '10 TO 12': 2.5,
        '11 TO 15': 3,
        '13 TO 15': 3,
        '16 TO 20': 4,
        '16 TO 18': 4,
        '19 TO 21': 4.5,
        '21 TO 25': 5,
        '22 TO 24': 5,
        '25 TO 27': 5.5,
        '26 TO 30': 6,
        '28 TO 30': 6,
        '31 TO 35': 7,
        '31 TO 33': 7,
        '34 TO 36': 7.5,
        '36 TO 40': 8,
        '37 TO 39': 8,
        '40 TO 42': 9,
        '43 TO 45': 10,
        '46 TO 48': 11,
        '49 TO 51': 12,
      };
      for (var i = 0; i < response.length; i++) {
        yearArr.push(response[i].year);
        storey_rangeArr.push(storey_rangeMapping[response[i].storey_range] ? storey_rangeMapping[response[i].storey_range] : 0);
        sizeArr.push(response[i].floor_area_sqm);
        priceArr.push(response[i].resale_price);
        leaseArr.push(response[i].remaining_lease);
      }
      const yearCorrelation = Math.abs(calCorrelation(yearArr, priceArr));
      const storeyRangeCorrelation = Math.abs(calCorrelation(storey_rangeArr, priceArr));
      const sizeCorrelation = Math.abs(calCorrelation(sizeArr, priceArr));
      const leaseCorrelation = Math.abs(calCorrelation(leaseArr, priceArr));
      res.send({
        yearCorrelation,
        storeyRangeCorrelation,
        sizeCorrelation,
        leaseCorrelation
      });
    })
    .catch((err) => {
      console.log(err);
      res.send('failure');
    });
};

module.exports = {
    getFlatStatsByType,
    getNeighbourhoodStatistics,
    getCorrelation
};