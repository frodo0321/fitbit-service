const requestLogger = require("node-tools/lib/middleware/request-logger");
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

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(requestLogger());

router.use("/api/v0", require("./routes"));

router.use(express.static("public"));
//const reverseProxy = require("node-tools/lib/middleware/reverse-proxy")
//router.use(reverseProxy("http://localhost:3000"))


router.use(function errorHandler(error, request, response, next) {
    console.error("error", _.pick(error, ["name", "message", "error"]));
    return response.json(_.pick(error, ["name", "message", "error"]));
})

const basePath = process.env.BASE_PATH || "/";
app.use(basePath, router);

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

