const fs = require("fs");
const path = require("path");
const debug = require("debug")(__filename);

debug("REREWRW");
var files = fs.readdirSync(__dirname)
debug(files);

files = files.filter(file => file != "index.js");
debug(files)

var files = files.filter(file => file.endsWith(".js"))
debug(files);

files = files.map(file => path.join(__dirname, file))
debug(files);


module.exports = function(app) {

    files.forEach(file => {
        var route = file.match(/.*((\/[^\/]*)\.js)/)[2]
        debug(file, route);
        require(file)(app, route);
    })

}
