/*
* Validation Controller
*/

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const tc = require("title-case");

/**
 * function to validate the user input is not empty and for seller, to ensure the postal code is valid
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
async function validateForm(req, res) {
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
        if (apiResponse.found === 0) {
          res.send({ status: "Invalid Postal Code" });
          return;
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
};

module.exports = { validateForm };