var express = require("express");
var app = express();

app.get("", function(req, res) {
    res.sendFile("index.html", {root: __dirname});
});

var server = app.listen(80, function() {
    console.log("Server started.");
});

