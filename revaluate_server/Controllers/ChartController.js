/*
 * Chart Controller
*/

//import models
const houseData = require("../Models/HouseData");

/**
 * function to get aggregated time-series data of resale prices of Singapore as a whole
 * @param {*} req 
 * @param {*} res 
 */
function getGeneralPricingChartData(req, res) {
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
};

/**
 * function to get time-series resale price data with two hues, one for the neighbourhood and one for Singapore as a whole
 * @param {*} req 
 * @param {*} res 
 */
function getNeighbourhoodPriceComparisonChart(req, res) {
    const reqData = req.query;
    const userType = reqData?.type;
    var singaporeData;
    var neighbourhoodData;
  
    //get time frame (past 10 years)
    const currentYear = new Date().getFullYear();
    var timeFrame = [];
    for (var i = 0; i < 10; i++) { timeFrame.push(currentYear - i); }
  
    //missing user type information
    if (!userType) { res.send({ 'status': 'Missing Information' }); return; }
    //entire Singapore
    var match;
    if (userType !== 'revaluate+') {
      match = { $and: [
      {'year': {$gte: timeFrame[9], $lte: timeFrame[0]}},
      {'flat_type': reqData.flat_type }
      ]};
    } else {
      match = { 'year': {$gte: timeFrame[9], $lte: timeFrame[0]}};
    }
    houseData.aggregate([
      { $match: match},
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
      } else if (userType === 'seller') { //user is a seller
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
      else if (userType === 'revaluate+') { //user is using premium service
        houseData.aggregate([
          { $match: { $and: [
            {'year': {$gte: timeFrame[9], $lte: timeFrame[0]}},
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
      else {res.send({status: 'error'});}
    })
    .catch((err) => console.log(err));
};

/**
 * function to get time-series transaction count data for a neighbourhood
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function getNeighbourhoodCountChart(req, res) {
    const reqData = req.query;
    const town = reqData?.town;
    var singaporeData;
    var neighbourhoodData;
  
    //get time frame (past 10 years)
    const currentYear = new Date().getFullYear();
    var timeFrame = [];
    for (var i = 0; i < 10; i++) { timeFrame.push(currentYear - i); }
  
    //missing user type information
    if (!town) { res.send({ 'status': 'Missing Information', 'singaporeCount': [], 'neighbourhoodCount': [], 'xAxis': [] }); return; }
  
    houseData.aggregate([
      { $match: { $and: [
        {'year': {$gte: timeFrame[9], $lte: timeFrame[0]}},
        {'town': reqData.town }
      ]}},
      { $group: {
          _id: '$year',
          count: { $count: {} }
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
        'xAxis': timeFrame
      });
    })
    .catch((err) => console.log(err))
};

/**
 * function to get the top 5 most affordable neighbourhoods and top 5 most valued neighbourhoods
 * @param {*} req 
 * @param {*} res 
 */
function getNeighbourhoodAffordability(req, res) {
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
};

module.exports = {
    getGeneralPricingChartData,
    getNeighbourhoodPriceComparisonChart,
    getNeighbourhoodCountChart,
    getNeighbourhoodAffordability
};