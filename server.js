// Lets require/import the HTTP module
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
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
var table1 = "CREATE TABLE IF NOT EXISTS PointsOfInterest (id SERIAL PRIMARY KEY, title TEXT, lng DOUBLE PRECISION, lat DOUBLE PRECISION, category TEXT, description TEXT, link TEXT, hasevents BOOLEAN, startdate TIMESTAMP, enddate TIMESTAMP, imagepath TEXT, r1 BOOLEAN, r2 BOOLEAN, r3 BOOLEAN, r4 BOOLEAN, r5 BOOLEAN, r6 BOOLEAN, r7 BOOLEAN, r8 BOOLEAN, r9 BOOLEAN, r10 BOOLEAN, r11 BOOLEAN, r12 BOOLEAN, r13 BOOLEAN, r14 BOOLEAN, r15 BOOLEAN)";
var table2 = "CREATE TABLE IF NOT EXISTS Events (id SERIAL PRIMARY KEY, title TEXT, startdate TIMESTAMP, enddate TIMESTAMP, allDay BOOLEAN, link TEXT, pointsofinterest_id SERIAL REFERENCES PointsOfInterest(id))";

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
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("INSERT INTO PointsOfInterest(title, lng, lat, category, description, link, hasevents, startdate, enddate, imagepath, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)",
          [req.body['title'], req.body['lng'], req.body['lat'], req.body['category'], req.body['description'], req.body['link'], req.body['hasevents'], req.body['startdate'], req.body['enddate'], req.body['imagepath'], req.body['r1'], req.body['r2'], req.body['r3'], req.body['r4'], req.body['r5'], req.body['r6'], req.body['r7'], req.body['r8'], req.body['r9'], req.body['r10'], req.body['r11'], req.body['r12'], req.body['r13'], req.body['r14'], req.body['r15']],
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("POI SAVED!");
                  done();
                  res.status(200);
              }
              //res.json({"id": this});
              res.end();
          });
    });
});


// Update Point of Interest
server.post('/updatePointOfInterest', function (req, res) {
    console.log("UpdatePointOfInterest");
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("UPDATE PointsOfInterest SET title=$1, lng=$2, lat=$3, category=$4, description=$5, link=$6, hasevents=$7, startdate=$8, enddate=$9, imagepath=$10, r1=$11, r2=$12, r3=$13, r4=$14, r5=$15, r6=$16, r7=$17, r8=$18, r9=$19, r10=$20, r11=$21, r12=$22, r13=$23, r14=$24, r15=$25 WHERE id = $26",
          [req.body['title'], req.body['lng'], req.body['lat'], req.body['category'], req.body['description'], req.body['link'], req.body['hasevents'], req.body['startdate'], req.body['enddate'], req.body['imagepath'], req.body['r1'], req.body['r2'], req.body['r3'], req.body['r4'], req.body['r5'], req.body['r6'], req.body['r7'], req.body['r8'], req.body['r9'], req.body['r10'], req.body['r11'], req.body['r12'], req.body['r13'], req.body['r14'], req.body['r15'], req.body['id']],
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("POI UPDATED! ID", req.body['id']);
                  done();
                  res.status(200);
              }
              //res.json({"id": this});
              res.end();
          });
    });
});

// Delete Point of Interest
server.post('/deletePointOfInterest', function (req, res) {
    console.log("deletePointOfInterest");
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("DELETE FROM PointsOfInterest WHERE id = $1", [req.body['id']],
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("POI DELETED! ID:", req.body['id']);
                  done();
                  res.status(200);
              }
              res.end();
          });
    });
});


// Delete All PointsOfInterest
server.post('/deleteAllPointsOfInterest', function (req, res) {
    console.log("deleteAllPointsOfInterest");
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("DELETE FROM PointsOfInterest",
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("ALL POIS DELETED!");
                  done();
                  res.status(200);
              }
              res.end();
          });
    });
});


// Get all PointsOfInterest
server.get('/getPointsOfInterest', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("SELECT * FROM PointsOfInterest", function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                console.log("POIS QUERY!");
                done();
                return res.json(result.rows);
            }
        })
    });
});

// Get POIs to JSON (for csv-Export)
server.get('/getPOIJson', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("SELECT * FROM PointsOfInterest", function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                console.log("POIS QUERY!");
                done();
                return res.json(result.rows);
            }
        })
    });
});


// Get EVENTSs to JSON (for csv-Export)
server.get('/getEventsJson', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("SELECT * FROM Events", function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                console.log("EVENTS QUERY!");
                done();
                return res.json(result.rows);
            }
        })
    });
});

// Server Event Communication
// Add new Event
server.post('/saveEvent', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query("INSERT INTO Events(title, startdate, enddate, allday, link, pointsofinterest_id) VALUES ($1,$2,$3,$4,$5,$6)",
          [req.body['title'], req.body['start'], req.body['end'], req.body['allday'], req.body['link'], req.body['pointsofinterest_id']],
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("EVENT SAVED!");
                  done();
                  res.status(200);
              }
              //res.json({"id": this});
              res.end();
          });
    });
});


// Get all Events
server.get('/getAllEvents', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("SELECT * FROM Events", function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                console.log("EVENTS QUERY!");
                done();
                return res.json(result.rows);
            }
        })
    });
});


// Get Events by ForeignKey
server.get('/getEventsByKey', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("SELECT * FROM Events WHERE pointsofinterest_id = $1", [req.query.key], function (err, result) {
            if (err) {
                return console.log('error receiving data', err)
            } else {
                console.log("EVENTS QUERY! FOREIGN KEY ", [req.query.key]);
                done();
                return res.json(result.rows);
            }
        })
    });
});

// /delete all events
server.post('/deleteAllEvents', function (req, res) {
    console.log("deleteAllEvents");
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("DELETE FROM Events",
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("ALL EVENTS DELETED!");
                  done();
                  res.status(200);
              }
              res.end();
          });
    });
});

// delete Elevents by Foreing Key
server.post('/deleteEventsByKey', function (req, res) {
    console.log("deleteEventsByKey");
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("DELETE FROM Events WHERE pointsofinterest_id = $1", [req.body['key']],
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("EVENT DELETED! FOREIGN KEY ", [req.body['key']]);
                  done();
                  res.status(200);
              }
              res.end();
          });
    });
});

// delete Event
server.post('/deleteEvent', function (req, res) {
    console.log("deleteEvent");
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('connection error', err)
        }
        client.query("DELETE FROM Events WHERE id = $1", [req.body['id']],
          function (err) {
              if (err) {
                  console.log(err);
                  res.status(500);
              }
              else {
                  console.log("EVENT DELETED! ID ", [req.body['id']]);
                  done();
                  res.status(200);
              }
              res.end();
          });
    });
});


//Lets start our server
server.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
    console.log("Server dirname", __dirname);
});