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
    db.run("CREATE TABLE IF NOT EXISTS markers (markerName TEXT, lng DOUBLE, lat DOUBLE, category TEXT, description TEXT, link TEXT, isEvent BOOLEAN, startDate DATETIME, endDate DATETIME, imagePath TEXT, " +
      "R1 BOOLEAN, R2 BOOLEAN, R3 BOOLEAN, R4 BOOLEAN, R5 BOOLEAN, R6 BOOLEAN, R7 BOOLEAN, R8 BOOLEAN, R9 BOOLEAN, R10 BOOLEAN, R11 BOOLEAN, R12 BOOLEAN, R13 BOOLEAN, R14 BOOLEAN, R15 BOOLEAN)");
});

// Server Database communication
// Save Marker to DB
server.post('/saveMarker', function(req, res){
    console.log("saveMarker");
    db.run("INSERT OR IGNORE INTO markers (markerName, lng, lat, category, description, link, isEvent, startDate, endDate, imagePath, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
      [req.body['markerName'], req.body['lng'], req.body['lat'], req.body['category'], req.body['description'], req.body['link'], req.body['isEvent'], req.body['startDate'], req.body['endDate'],  req.body['imagePath'], req.body['R1'], req.body['R2'], req.body['R3'], req.body['R4'], req.body['R5'], req.body['R6'], req.body['R7'], req.body['R8'], req.body['R9'], req.body['R10'], req.body['R11'], req.body['R12'], req.body['R13'], req.body['R14'], req.body['R15']], function(err){
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

// Delete All Marker
server.post('/deleteAllMarker', function(req, res){
    console.log("deleteAllMarker");
    db.run("DELETE FROM markers", function(err){
        if (err){
            console.log(err);
            res.status(500);

        }
        else {
            console.log("ALL DELETED!");
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