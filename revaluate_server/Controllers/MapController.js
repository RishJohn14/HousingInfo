/*
* Map Controller
*/

//import models
const houseData = require("../Models/HouseData");

/**
 * function to get all the unique latitude and longitude of past transactions so frontend can display it in terms of pins
 * @param {*} req 
 * @param {*} res 
 */
async function getMapData(req, res) {
    const reqData = req.query;
    const houseType = reqData?.houseType;
    const minPrice = reqData?.minPrice;
    const maxPrice = reqData?.maxPrice;
    if (!houseType || (houseType !== '1 ROOM' && houseType !== '2 ROOM' && houseType !== '3 ROOM' && houseType !== '4 ROOM' && houseType !== '5 ROOM' && houseType !== 'EXECUTIVE' && houseType !== 'MULTI-GENERATIONAL')) {
      res.send({status: 'Invalid Inputs - HouseType'});
      return;
    }
    if (Number.isNaN(minPrice) || Number.isNaN(maxPrice) || maxPrice <= minPrice) {
      res.send({status: 'Invalid Inputs - Price Range'});
      return;
    }
    houseData
      .aggregate([
        {
          $match: { $and: [
            //same house type
            {flat_type: houseType},

            //fit within price range
            {resale_price: {$gte: Math.min(minPrice, 0), $lte: Math.min(maxPrice, 9999999)}}
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
        res.send({data: response, status: 'success'});
      })
      .catch((err) => {
        console.log(err);
        res.send({'status': 'error'});
      }); /* cannot be found */
};

/**
 * function to get past transactions for a particular location with its latitude and longitude
 * @param {*} req 
 * @param {*} res 
 */
function getTransactionsFromPin(req, res) {
    const reqData = req.query;
    const houseType = reqData?.flat_type;
    if (!reqData?.latitude || reqData?.latitude < 1.2258860606437172 || reqData.latitude > 1.3578242506601004) {
      res.send({status: 'Invalid Inputs - Latitude'});
      return;
    }
    if (!reqData?.longitude || reqData?.longitude < 103.80877010434992 || reqData?.longitude > 103.83315507774375) {
      res.send({status: 'Invalid Inputs - Longitude'});
      return;
    }
    if (!houseType || (houseType !== '1 ROOM' && houseType !== '2 ROOM' && houseType !== '3 ROOM' && houseType !== '4 ROOM' && houseType !== '5 ROOM' && houseType !== 'EXECUTIVE' && houseType !== 'MULTI-GENERATIONAL')) {
      res.send({status: 'Invalid Inputs - House Type'});
      return;
    }
    houseData.find({$and: [
        {latitude: reqData?.latitude},
        {longitude: reqData?.longitude},
        {flat_type: houseType},
    ]})
    .then((response) => {
        res.send({'status': 'success', 'data': response});
    })
    .catch((err) => res.send({'status': 'error'}))
};

module.exports = {
    getMapData,
    getTransactionsFromPin
};

