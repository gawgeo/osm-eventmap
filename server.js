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

var sqliteJSON = require('sqlite-json');
var exporter = sqliteJSON(file);

if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, "w");
}
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS PointsOfInterest (id INTEGER PRIMARY KEY, title TEXT, lng DOUBLE, lat DOUBLE, category TEXT, description TEXT, link TEXT, isEvent BOOLEAN, startDate DATETIME, endDate DATETIME, imagePath TEXT, R1 BOOLEAN, R2 BOOLEAN, R3 BOOLEAN, R4 BOOLEAN, R5 BOOLEAN, R6 BOOLEAN, R7 BOOLEAN, R8 BOOLEAN, R9 BOOLEAN, R10 BOOLEAN, R11 BOOLEAN, R12 BOOLEAN, R13 BOOLEAN, R14 BOOLEAN, R15 BOOLEAN)");
    db.run("CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY, title TEXT, start DATETIME, end DATETIME, allDay BOOLEAN, pointsOfInterest_id INTEGER, FOREIGN KEY(pointsOfInterest_id) REFERENCES PointsOfInterest(id))");
});

// Server Database communication
// Save PointsOfInterest to DB
server.post('/savePointOfInterest', function(req, res){
    console.log("savePointOfInterest");
    db.run(
      "INSERT OR IGNORE INTO PointsOfInterest(title, lng, lat, category, description, link, isEvent, startDate, endDate, imagePath, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [req.body['title'], req.body['lng'], req.body['lat'], req.body['category'], req.body['description'], req.body['link'], req.body['isEvent'], req.body['startDate'], req.body['endDate'],  req.body['imagePath'], req.body['R1'], req.body['R2'], req.body['R3'], req.body['R4'], req.body['R5'], req.body['R6'], req.body['R7'], req.body['R8'], req.body['R9'], req.body['R10'], req.body['R11'], req.body['R12'], req.body['R13'], req.body['R14'], req.body['R15']], function(err){
        if (err){
            console.log(err);
            res.status(500);
        }
        else {
            console.log("SAVED! mit ID: " + this.lastID);
            res.status(202);
        }
          res.json({"id": this.lastID});
        res.end();
    });
});

// Update Point of Interest
server.post('/updatePointOfInterest', function(req, res) {
    console.log("UpdatePointOfInterest");
    db.run("UPDATE PointsOfInterest SET title=?, lng=?, lat=?, category=?, description=?, link=?, isEvent=?, startDate=?, endDate=?, imagePath=?, R1=?, R2=?, R3=?, R4=?, R5=?, R6=?, R7=?, R8=?, R9=?, R10=?, R11=?, R12=?, R13=?, R14=?, R15=?" +
      "WHERE id=?",
      [req.body['title'], req.body['lng'], req.body['lat'], req.body['category'], req.body['description'], req.body['link'], req.body['isEvent'], req.body['startDate'], req.body['endDate'],  req.body['imagePath'], req.body['R1'], req.body['R2'], req.body['R3'], req.body['R4'], req.body['R5'], req.body['R6'], req.body['R7'], req.body['R8'], req.body['R9'], req.body['R10'], req.body['R11'], req.body['R12'], req.body['R13'], req.body['R14'], req.body['R15'], req.body['id']],
      function(err){
        if (err){
            console.log(err);
            res.status(500);
        }
        else {
            console.log("POI UPDATED!");
            res.status(202);
        }
        res.end();
    });
});

// Delete Point of Interest
server.post('/deletePointOfInterest', function(req, res){
    console.log("deletePointOfInterest");
    db.run("DELETE FROM PointsOfInterest WHERE id=?", [req.body['id']], function(err){
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

// Delete All PointsOfInterest
server.post('/deleteAllPointsOfInterest', function(req, res){
    console.log("deleteAllPointsOfInterest");
    db.run("DELETE FROM PointsOfInterest", function(err){
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

// Get all PointsOfInterest
server.get('/getPointsOfInterest', function(req, res){
    db.all("SELECT * FROM PointsOfInterest", function(err, rows){
        if (err){
            console.log(err);
            res.status(400);

        } else {
            res.json(rows);
        }
    });
});

// Get POIs to JSON (for csv-Export)
server.get('/getPOIJson', function(req, res){
    exporter.json('select * FROM PointsOfInterest', function (err, json) {
        if (err){
            console.log(err);
            res.status(400);
        }
        else {
            console.log(json);
            res.send(json);
        }
    });
});

// Server Event Communication
// Add new Event
server.post('/saveEvent', function(req, res){
    db.run(
      "INSERT OR IGNORE INTO Events(title, start, end, allDay, pointsOfInterest_id) VALUES (?,?,?,?,?)",
      [req.body['title'], req.body['start'], req.body['end'], req.body['allDay'], req.body['pointsOfInterest_id']], function(err){
          if (err){
              console.log(err);
              res.status(500);
          }
          else {
              console.log("SAVED NEW EVENT!");
              res.status(202);
          }
          res.end();
      });
});

// Get Events by ForeignKey
server.get('/getEventsByKey', function(req, res){
    db.all("SELECT * FROM Events WHERE pointsOfInterest_id=?", [req.query.key], function(err, rows){
        if (err){
            console.log(err);
            res.status(400);

        } else {
            res.json(rows);
        }
    });
});

// Get all Events
server.get('/getAllEvents', function(req, res){
    db.all("SELECT * FROM Events", function(err, rows){
        if (err){
            console.log(err);
            res.status(400);

        } else {
            res.json(rows);
        }
    });
});

server.post('/deleteAllEvents', function(req, res){
    console.log("deleteAllEvents");
    db.run("DELETE FROM Events", function(err){
        if (err){
            console.log(err);
            res.status(500);

        }
        else {
            console.log("ALL EVENTS DELETED!");
            res.status(202);
        }
        res.end();
    });
});

server.post('/deleteEvent', function(req, res){
    console.log("deleteEvent");
    db.run("DELETE FROM Events WHERE id=?", [req.body['id']], function(err){
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

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
    console.log("Server dirname", __dirname);
});