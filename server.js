var express = require("express");
var exec = require('child_process').exec;
var app = express();
var auth = require('basic-auth');

var fs = require('fs');
var wolPassword;
var shutdownCredentials;
var shutdownIP;
fs.readFile(__dirname + '/wol_password.txt', 'utf8', function(err, data) {
    if (err) throw err;
    lines = data.split("\n"); 
    wolPassword = lines[0];
    shutdownIP = lines[1];
    shutdownCredentials = lines[2];
}); 

app.get("/", function(req, res) {
    res.sendFile("index.html", {root: __dirname});
});

app.get("/wol", function(req, res) {
    res.sendFile("wol.html", {root: __dirname});
});

app.post("/wol/wake", function(req, res) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== 'wol' || credentials.pass != wolPassword) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="WOL"')
        res.end('Access denied')
    } else {
        var cmd = 'etherwake 14:da:e9:10:53:46';
        exec(cmd, function(error, stdout, stderr) {
            if(stdout + stderr == "")
                res.send("The computer has been woken!");
            else
                res.send(stdout + stderr);
    });
  }
});

app.post("/wol/shutdown", function(req, res) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== 'wol' || credentials.pass != wolPassword) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="WOL"')
        res.end('Access denied')
    } else {
        var cmd = 'net rpc shutdown -I ' + shutdownIP + ' -U ' + shutdownCredentials;
        exec(cmd, function(error, stdout, stderr) {
            res.end(stdout + stderr);
    });
  }
});

app.get("/wol/check", function(req, res) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== 'wol' || credentials.pass != wolPassword) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="WOL"')
        res.end('Access denied')
    } else {
        var cmd = 'ping ' + shutdownIP + ' -c 1';
        exec(cmd, function(error, stdout, stderr) {
            if(error == null)
                res.send("The computer is on.");
            else
                res.send("The computer is off.");
        });
    }
});

app.use(express.static(__dirname));
var server = app.listen(8080, function() {
    console.log("Server started.");
});
