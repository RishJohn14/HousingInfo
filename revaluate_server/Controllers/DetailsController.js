/*
* Details Controller
*/

//import models
const houseData = require("../Models/HouseData");
const DetailsBuyerStrategy = require("./DetailsBuyerStrategy");
const DetailsSellerStrategy = require("./DetailsSellerStrategy");

/**
 * function to perform aggregation and filtering based on search filters and return search results
 * @param {*} req 
 * @param {*} res 
 */
async function getDetails(req, res) {
    const userType = req.query.type;
    const strategies = {
      'buyer': DetailsBuyerStrategy,
      'seller': DetailsSellerStrategy
    }
    strategies[userType].getDetails(req, res);
};

/**
 * function that uses a series of logic to provide recommendations based on search filters
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
      if (response.length <= 0) {res.send({ 'status': 'No Info Found' }); return;}
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
        res.send({'status': 'success', 'town': suitableTown, 'data': response});
      })
      .catch((err) => res.send({ 'status': 'error' }))
    })
    .catch((err) => res.send({ 'status': 'error' }))
};

module.exports = {
    getDetails,
    getAdvice
}