//Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser')

//Lets define a port we want to listen to
const PORT=8080;

//Create a server
var server = express();
server.use(express.static(__dirname));
server.use(bodyParser.json() );

//Initialize DB
var fs = require("fs");
var file = 'test.db';
var exists = fs.existsSync(file);

if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, "w");
}
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS markers (markerName TEXT, lng DOUBLE, lat DOUBLE)");
});

// Server Database communication
// Save Marker to DB
server.post('/saveMarker', function(req, res){
    console.log("saveMarker");
    db.run("INSERT OR IGNORE INTO markers (markerName, lng, lat) VALUES (?,?,?)", [req.body['markerName'], req.body['lng'], req.body['lat']], function(err){
        if (err){
            console.log(err);
            res.status(500);

        }
        else {
            console.log("SAVED!");
            res.status(202);
        }
        res.end();
    });
});

// Delete Marker
server.post('/deleteMarker', function(req, res){
    console.log("deleteMarker");
    db.run("DELETE FROM markers WHERE markerName=? AND lng=? AND lat=?", [req.body['markerName'], req.body['lng'], req.body['lat']], function(err){
        if (err){
            console.log(err);
            res.status(500);

        }
        else {
            console.log("DELETED!");
            res.status(202);
        }
        res.end();
    });
});

// Get all Markers
server.get('/getMarkers', function(req, res){
    db.all("SELECT * FROM markers", function(err, rows){
        if (err){
            console.log(err);
            res.status(400);

        } else {
            res.json(rows);
        }
    });
});


//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
    console.log("Server dirname", __dirname);
});