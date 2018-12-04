const rp = require("request-promise");
const hb = require("handlebars");
const moment = require("moment");

const debug = require("debug")(__filename);

// https://dev.fitbit.com/build/reference/web-api/heart-rate/

export default class HeartRateAPIController {

    constructor(args={}) {
        // handle authentication and such
        this.bearerToken = args.bearerToken;
        debug("BEARER TOKEN", this.bearerToken);
    }

    static getHeartRateUrl(args) {
        const heartRateUrlTemplate = hb.compile("https://web-api.fitbit.com/1/user/{{user-id}}/activities/heart/date/{{date}}/{{period}}.json");
        return heartRateUrlTemplate(args);
    }

    async fetch(args={}) {

        var options = {
            method: "GET",
            uri: HeartRateAPIController.getHeartRateUrl(args),
            headers: {
                authorization: "Bearer " + this.bearerToken
            }
        };

        debug("request options", options);
        var response = rp(options).then(data => {
            return JSON.parse(data);
        });

        return response;
    
    }

    async getLatestHeartRate() {

        var args = {
            "user-id": "-", // for the authenticated user
            date: "today",
            period: "1d"
        };

        var heartRateData = await this.fetch(args);
        //console.log(heartRateData);
        var heartRateTimeSeries = heartRateData["activities-heart-intraday"].dataset;
        var latestHeartRateMeasurement = heartRateTimeSeries[heartRateTimeSeries.length - 1];
        debug("latest heart rate measurement", latestHeartRateMeasurement);

        var todaysDate = moment().format("YYYY-MM-DD");
        var measurementTimeAsMoment = moment(todaysDate + "T" + latestHeartRateMeasurement.time)

        latestHeartRateMeasurement.time = measurementTimeAsMoment;
        
        return latestHeartRateMeasurement;
    }

}

