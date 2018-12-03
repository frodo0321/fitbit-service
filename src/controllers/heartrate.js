const rp = require("request-promise");
const hb = require("handlebars");
const moment = require("moment");

// https://dev.fitbit.com/build/reference/web-api/heart-rate/

export default class HeartRateAPIController {

    constructor(args={}) {
        // handle authentication and such
        this.bearerToken = args.bearerToken;
        console.log("BEARER TOKEN", this.bearerToken);
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

        console.log(options);
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
        console.log("heartrate data", heartRateData);
        var heartRateTimeSeries = heartRateData["activities-heart-intraday"].dataset;
        console.log("heartrate heartRateTimeSeries", heartRateTimeSeries);
        var latestHeartRateMeasurement = heartRateTimeSeries[heartRateTimeSeries.length - 1];
        console.log("latest heart rate measurement", latestHeartRateMeasurement);

        var todaysDate = moment().format("YYYY-MM-DD");
        var measurementTimeAsMoment = moment(todaysDate + "T" + latestHeartRateMeasurement.time)

        latestHeartRateMeasurement.time = measurementTimeAsMoment;
        
        return latestHeartRateMeasurement;
    }

}

