require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

const schema = new mongoose.Schema({
    _id: { type: Number, required: true },
    month: { type: String, required: true },
    town: { type: String, required: true },
    flat_type: { type: String, required: true },
    block: { type: String, required: true },
    street_name: { type: String, required: true },
    storey_range: { type: String, required: true },
    floor_area_sqm: { type: String, required: true },
    flat_model: { type: String, required: true },
    lease_commence_date: { type: String, required: true },
    resale_price: { type: String, required: true },
    remaining_lease: { type: String, required: true },
    postal_code: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
}, { collection: 'transactionsData'});

const model = mongoose.model('transactionsData', schema);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.get("/details", async (req, res) => {
    await model.find({'town': req.query.town, 'flat_type': req.query.flat_type})
    .then((response) => { /* can be found */
        console.log('success');
        res.send(response);
    }).catch((err) => {console.log(err)}); /* cannot be found */
});

app.get("/map", async (req, res) => {
    await model.find({'town': "YISHUN"})
    .then((response) => { /* can be found */
        console.log(response.length);
        console.log('success');
        res.send(response);
    }).catch((err) => {console.log(err)}); /* cannot be found */
});

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
    console.log(`Express server is up`);
});