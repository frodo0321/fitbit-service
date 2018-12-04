import moment from "moment";

const debug = require("debug")(__filename);


export default class CachedFetcher {

    constructor(fetchFunction, args={maxAge: 1 * 60 * 60 * 1000}) {
        debug("CachedFetcher.constructor()", arguments)

        this._maxAge = null;
        this._fetchFunction = null;
        this._cachedData = null;
        this._timestamp = null;

        this._maxAge = args.maxAge;
        this._fetchFunction = fetchFunction;
    }

    async fetch(args) {
        debug("CachedFetcher.fetch()", this._timestamp);

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
        debug("fetching new data...");
        var data = await this._fetchFunction(args);
        this._cachedData = data;
        this._timestamp = moment();
        return data;
    }

}
