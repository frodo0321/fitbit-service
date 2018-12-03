const _ = require("lodash");
const bluebird = require("bluebird");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const hb = require("handlebars");
const moment = require("moment");
const rp = require("request-promise");


const app = express();

console.clear();

dotenv.config();

//import db from "sqlite";

import HeartRateAPIController from "./controllers/heartrate";

//const HEARTRATE_TABLE_NAME = "heartrate_data";

//async function initDb() {
//
//    await db.open("db.sqlite", {Promise: bluebird});
//
//
//    var tableSql = hb.compile("CREATE TABLE IF NOT EXISTS heartrate_data (id INTEGER PRIMARY KEY)")({tableName: HEARTRATE_TABLE_NAME})
//
//    var result = await db.run(tableSql)
//
//    //var heartRateApiController = new HeartRateAPIController({bearerToken: process.env["FITBIT_BEARER_TOKEN"]});
//    //var data = await heartRateApiController.getLatestHeartRate();
//    //console.log(data);
//    //console.log(data);
//
//}
//initDb().catch(console.error)

class CachedFetcher {

    constructor(fetchFunction, args={maxAge: 1 * 60 * 60 * 1000}) {
        console.log("CachedFetcher.constructor()", arguments)

        this._maxAge = null;
        this._fetchFunction = null;
        this._cachedData = null;
        this._timestamp = null;

        this._maxAge = args.maxAge;
        this._fetchFunction = fetchFunction;
    }

    async fetch(args) {
        console.log("CachedFetcher.fetch()", this._timestamp);

        if (this._timestamp == null) {
            return this._fetchAndUpdateCache(args);
        }

        var age = moment() - this._timestamp;
        if (age > this._maxAge) {
            return this._fetchAndUpdateCache(args);
        }

        return this._cachedData;
    }

    async _fetchAndUpdateCache(args) {
        console.log("fetching new data...");
        var data = await this._fetchFunction(args);
        this._cachedData = data;
        this._timestamp = moment();
        return data;
    }

}

const cachedFetcher = new CachedFetcher(async function fetchFunction(args) {
    console.log("fetchFunction");
    const heartRateApiController = new HeartRateAPIController({bearerToken: process.env["FITBIT_BEARER_TOKEN"]});
    var latestHeartRateMeasurement = await heartRateApiController.getLatestHeartRate();
    return latestHeartRateMeasurement;
}, {maxAge: 2 * 1000});

app.get("/latest-heart-rate", function(request, response, next) {

    bluebird.resolve().then(async () => {

        console.log("get latest heart rate");

        var cachedData = await cachedFetcher.fetch()
        console.log("cachedData", cachedData);

        response.json({latestHeartRate: cachedData.value})
        
    })

})

app.use(function errorHandler(error, request, response, next) {
    return response.json(error);
})


var PORT = 8000
app.listen(PORT, function() {
    console.log("Server started at http://localhost:" + PORT);
})


process.on("uncaughtException", error => {
    console.error(error);
    process.exit(1); // not optional
});

// test the endpoint
rp({method: "GET", uri: "http://localhost:8000/latest-heart-rate"})
    .then(response => {console.log("response", response)})
    .catch(error => {console.log("error", error)})

setInterval(() => {}, 1000)
