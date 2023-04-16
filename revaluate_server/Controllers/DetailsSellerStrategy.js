/*
* Details Buyer Strategy
*/

//import models
const houseData = require("../Models/HouseData");

/**
 * function to perform aggregation and filtering based on search filters and return search results for sellers
 * @param {*} reqData
 */
function getDetails(req, res) {
    const reqData = req.query;

    houseData
    .find(
    { latitude: { $gte: Number(reqData?.latitude) - 0.02, $lte: Number(reqData?.longitude) + 0.02 },
        longitude: { $gte: Number(reqData?.longitude) - 0.02, $lte: Number(reqData?.longitude) + 0.02 },
        flat_type: reqData?.sellerHouseType },
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
    res.send([]);
    }); /* cannot be found */
};

module.exports = {
    getDetails
}