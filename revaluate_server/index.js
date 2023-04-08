/*
 * Import dependencies
 */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_LINK);

/*
 * Server initialisation
 */
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`Express server is up`);
});

/*
 * Controllers
 */
const ChartController = require('./Controllers/ChartController');
const MapController = require('./Controllers/MapController');
const StatsController = require('./Controllers/StatsController');
const DetailsController = require('./Controllers/DetailsController');
const ForumController = require('./Controllers/ForumManager');
const ValidationController = require('./Controllers/ValidationController');

/*
 * Routes (API endpoints)
 */
app.get("/", (req, res) => {
  console.log(req.query);
  res.send("Welcome to REvaluate Server");
});

app.get('/getTransactionsFromPin', MapController.getTransactionsFromPin)

app.get("/neighbourhoodAffordability", ChartController.getNeighbourhoodAffordability);

app.get("/flatStatsByType", StatsController.getFlatStatsByType);

app.get("/validateform", ValidationController.validateForm);

app.get("/generalPricingChart", ChartController.getGeneralPricingChartData);

app.get("/neighbourhoodPriceComparisonChart", ChartController.getNeighbourhoodPriceComparisonChart);

app.get("/details", DetailsController.getDetails);

app.get("/map", MapController.getMapData);

app.get("/neighbourhoodCountChart", ChartController.getNeighbourhoodCountChart);

app.get("/neighbourhoodStatistics", StatsController.getNeighbourhoodStatistics);

app.get("/roboadvisor", DetailsController.getAdvice);

app.get('/forumTopics', ForumController.getForumTopics);

app.get('/forumPosts', ForumController.getForumPosts);

app.post('/addpost', ForumController.addPost);

app.get('/getpostdata', ForumController.getPostDataById);

app.post('/addcomment', ForumController.addComment);

app.get('/correlation', StatsController.getCorrelation);
