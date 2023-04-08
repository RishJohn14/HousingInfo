/*
* Map Controller
*/

//import models
const houseData = require("../Models/HouseData");

/**
 * function to get all the unique latitude and longitude of past transactions so frontend can display it in terms of pins
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
async function getMapData(req, res) {
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
};

/**
 * function to get past transactions for a particular location with its latitude and longitude
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
function getTransactionsFromPin(req, res) {
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
};

module.exports = {
    getMapData,
    getTransactionsFromPin
};

