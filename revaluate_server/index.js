require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
    console.log(`Express server is up`);
});