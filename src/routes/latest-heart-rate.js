import HeartRateAPIController from "../controllers/heartrate";
import CachedFetcher from "../utils/cached-fetcher";
import bluebird from "bluebird";

const debug = require("debug")(__filename);


module.exports = function(app, route) {

    const cachedFetcher = new CachedFetcher(async function fetchFunction(args) {
        debug("fetchFunction");
        const heartRateApiController = new HeartRateAPIController({bearerToken: process.env["FITBIT_BEARER_TOKEN"]});
        var latestHeartRateMeasurement = await heartRateApiController.getLatestHeartRate();
        return latestHeartRateMeasurement;
    }, {maxAge: 1 * 60 * 60 * 1000});

    app.get("/latest-heart-rate", function(request, response, next) {

        bluebird.resolve().then(async () => {

            debug("get latest heart rate");

            var cachedData = await cachedFetcher.fetch()
            debug("cachedData", cachedData);

            response.json({latestHeartRate: cachedData.value})
            
        })

    })


}
