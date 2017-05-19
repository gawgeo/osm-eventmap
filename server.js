// Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var sqliteJSON = require('sqlite-json');
var pg = require("pg");
var pgp = require('pg-promise')(/*options*/);

// Lets define a port we want to listen to
const PORT = process.env.PORT || 8080;
// Create a server
var server = express();
server.use(express.static(__dirname));
server.use(bodyParser.json());

// Database config
var conString = process.env.DATABASE_URL || "pg://localAdmin:robin1988@localhost:5432/osm";
var config = {
    user: 'localAdmin', //env var: PGUSER
    database: 'osm', //env var: PGDATABASE
    password: 'robin1988', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);

//Initialize DB
var client = new pg.Client(conString);
//Create Poi and Events Table
var table1 = "CREATE TABLE IF NOT EXISTS PointsOfInterest (id SERIAL PRIMARY KEY, title TEXT, lng DOUBLE PRECISION, lat DOUBLE PRECISION, category TEXT, description TEXT, link TEXT, hasEvents BOOLEAN, startDate TIMESTAMP, endDate TIMESTAMP, imagePath TEXT, R1 BOOLEAN, R2 BOOLEAN, R3 BOOLEAN, R4 BOOLEAN, R5 BOOLEAN, R6 BOOLEAN, R7 BOOLEAN, R8 BOOLEAN, R9 BOOLEAN, R10 BOOLEAN, R11 BOOLEAN, R12 BOOLEAN, R13 BOOLEAN, R14 BOOLEAN, R15 BOOLEAN)";
var table2 = "CREATE TABLE IF NOT EXISTS Events (id SERIAL PRIMARY KEY, title TEXT, startDate TIMESTAMP, endDate TIMESTAMP, allDay BOOLEAN, link TEXT, pointsOfInterest_id SERIAL REFERENCES PointsOfInterest(id))";

var db = pgp(config);
db.tx(function (t) {
    return t.batch([
        t.none(table1),
        t.none(table2)
    ]);
}).then(function () {
    console.log("Successfully created tables");
}).catch(function (error) {
      console.log("error: ", error);
  }
);


// Server Database communication
// Save PointsOfInterest to DB
server.post('/savePointOfInterest', function (req, res) {
    console.log("savePointOfInterest");
    pool.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        pool.query("INSERT INTO PointsOfInterest(title, lng, lat, category, description, link, hasEvents, startDate, endDate, imagePath, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)",
          [req.body['title'], req.body['lng'], req.body['lat'], req.body['category'], req.body['description'], req.body['link'], req.body['hasEvents'], req.body['startDate'], req.body['endDate'], req.body['imagePath'], req.body['R1'], req.body['R2'], req.body['R3'], req.body['R4'], req.body['R5'], req.body['R6'], req.body['R7'], req.body['R8'], req.body['R9'], req.body['R10'], req.body['R11'], req.body['R12'], req.body['R13'], req.body['R14'], req.body['R15']],
          function (err) {
              if (err) {
                  console.log(err, req.body['startDate']);
                  res.status(500);
              }
              else {
                  res.status(200);
              }
              //res.json({"id": this});
              res.end();
          });
    });
});

/*
 // Update Point of Interest
 server.post('/updatePointOfInterest', function (req, res) {
 console.log("UpdatePointOfInterest");
 client.query("UPDATE PointsOfInterest SET title=?, lng=?, lat=?, category=?, description=?, link=?, hasEvents=?, startDate=?, endDate=?, imagePath=?, R1=?, R2=?, R3=?, R4=?, R5=?, R6=?, R7=?, R8=?, R9=?, R10=?, R11=?, R12=?, R13=?, R14=?, R15=?" +
 "WHERE id = ?",
 [req.body['title'], req.body['lng'], req.body['lat'], req.body['category'], req.body['description'], req.body['link'], req.body['hasEvents'], req.body['startDate'], req.body['endDate'], req.body['imagePath'], req.body['R1'], req.body['R2'], req.body['R3'], req.body['R4'], req.body['R5'], req.body['R6'], req.body['R7'], req.body['R8'], req.body['R9'], req.body['R10'], req.body['R11'], req.body['R12'], req.body['R13'], req.body['R14'], req.body['R15'], req.body['id']],
 function (err) {
 if (err) {
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
 server.post('/deletePointOfInterest', function (req, res) {
 console.log("deletePointOfInterest");
 client.query("DELETE FROM PointsOfInterest WHERE id=?", [req.body['id']], function (err) {
 if (err) {
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
 server.post('/deleteAllPointsOfInterest', function (req, res) {
 console.log("deleteAllPointsOfInterest");
 client.query("DELETE FROM PointsOfInterest", function (err) {
 if (err) {
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
 */

// Get all PointsOfInterest
server.get('/getPointsOfInterest', function (req, res) {
    pool.connect(function (err) {
        if (err) {
            return console.log('connection error', err)
        }
        pool.query("SELECT * FROM PointsOfInterest", function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                return res.json(result.rows);
            }
        })
    });
});

/*
 // Get POIs to JSON (for csv-Export)
 server.get('/getPOIJson', function (req, res) {
 exporter.json('select * FROM PointsOfInterest', function (err, json) {
 if (err) {
 console.log(err);
 res.status(400);
 }
 else {
 console.log(json);
 res.send(json);
 }
 });
 });
 // Get EVENTSs to JSON (for csv-Export)
 server.get('/getEventsJson', function (req, res) {
 exporter.json('select * FROM Events', function (err, json) {
 if (err) {
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
 server.post('/saveEvent', function (req, res) {
 client.query(
 "INSERT INTO Events(title, start, end, allDay, link, pointsOfInterest_id) VALUES (?,?,?,?,?,?)",
 [req.body['title'], req.body['start'], req.body['end'], req.body['allDay'], req.body['link'], req.body['id']], function (err) {
 if (err) {
 console.log(err);
 res.status(500);
 }
 else {
 console.log("SAVED NEW EVENT!", req.body['id']);
 res.status(202);
 }
 res.end();
 });
 });

 */
// Get all Events
server.get('/getAllEvents', function (req, res) {
    pool.connect(function (err) {
        if (err) {
            return console.log('connection error', err)
        }
        pool.query("SELECT * FROM Events", function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                return res.json(result.rows);
            }
        })
    });
});


// Get Events by ForeignKey
server.get('/getEventsByKey', function (req, res) {
    pool.connect(function (err) {
        if (err) {
            return console.log('connection error', err)
        }
        pool.query("SELECT * FROM Events WHERE id = $1", [req.query.key], function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                return res.json(result.rows);
            }
        })
    });
});


/*
 // /deleteAllEvents
 server.post('/deleteAllEvents', function (req, res) {
 console.log("deleteAllEvents");
 client.query("DELETE FROM Events", function (err) {
 if (err) {
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
 // delete Elevents by Foreing Key
 server.post('/deleteEventsByKey', function (req, res) {
 console.log("deleteEventsByKey");
 client.query("DELETE FROM Events WHERE pointsOfInterest_id=?", [req.body['key']], function (err) {
 if (err) {
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
 // delete Event
 server.post('/deleteEvent', function (req, res) {
 console.log("deleteEvent");
 client.query("DELETE FROM Events WHERE id=?", [req.body['id']], function (err) {
 if (err) {
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


 */

//Lets start our server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
    console.log("Server dirname", __dirname);
});