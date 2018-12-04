const _ = require("lodash");
const bluebird = require("bluebird");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const rp = require("request-promise");

dotenv.config();
const debug = require("debug")(__filename);

console.clear();


const app = express();

require("./routes")(app);


app.use(function errorHandler(error, request, response, next) {
    console.error("error", _.pick(error, ["name", "message", "error"]));
    return response.json(_.pick(error, ["name", "message", "error"]));
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
debug("\nTesting latest-heart-rate\n")
rp({method: "GET", uri: "http://localhost:8000/latest-heart-rate"})
    .then(response => {debug("response", response)})
    .catch(error => {debug("error", error.error)})

