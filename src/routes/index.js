const express = require("express");
const fs = require("fs");
const path = require("path");
const debug = require("debug")(__filename);

const router = express.Router()

debug("REREWRW");
var files = fs.readdirSync(__dirname)
debug(files);

files = files.filter(file => file != "index.js");
debug(files)

var files = files.filter(file => file.endsWith(".js"))
debug(files);

files = files.map(file => path.join(__dirname, file))
debug(files);


files.forEach(file => {
    var route = file.match(/.*((\/[^\/]*)\.js)/)[2]
    debug(file, route);
    require(file)(router, route);
})

module.exports = router;
