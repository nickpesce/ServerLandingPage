var express = require("express");
var exec = require('child_process').exec;
var app = express();
var auth = require('basic-auth');
app.use(express.static(__dirname));

var fs = require('fs');
var wolPassword;
fs.readFile(__dirname + '/wol_password.txt', 'utf8', function(err, data) {
    if (err) throw err;
    wolPassword = data.trim();
}); 

app.get("/", function(req, res) {
    res.sendFile("index.html", {root: __dirname});
});

app.get("/wol", function(req, res) {
    res.sendFile("wol.html", {root: __dirname});
});

app.post("/wol", function(req, res) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== 'wol' || credentials.pass != wolPassword) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="WOL"')
        res.end('Access denied')
    } else {
        var cmd = 'etherwake 14:da:e9:10:53:46';
        exec(cmd, function(error, stdout, stderr) {
    });
    res.end('Computer has been woken.')
  }
});

var server = app.listen(80, function() {
    console.log("Server started.");
});

