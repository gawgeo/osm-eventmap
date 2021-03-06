//Initialize DB
var fs = require("fs");
var file = 'test.db';

var testData = require('./testSeed');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    console.log("SEED DATABASE");
    testData.pois.forEach(function(poi) {
        db.run("INSERT OR IGNORE INTO PointsOfInterest (title, lng, lat, category, description, link, hasEvents, startDate, endDate, imagePath, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
              poi['title'],
              poi['lng'],
              poi['lat'],
              poi['category'],
              poi['description'],
              poi['link'],
              poi['hasEvents'],
              poi['startDate'],
              poi['endDate'],
              poi['imagePath'],
              poi['R1'],
              poi['R2'],
              poi['R3'],
              poi['R4'],
              poi['R5'],
              poi['R6'],
              poi['R7'],
              poi['R8'],
              poi['R9'],
              poi['R10'],
              poi['R11'],
              poi['R12'],
              poi['R13'],
              poi['R14'],
              poi['R15']
          ],
          function(err){
              if (err){
                  console.log(err);

              }
              else {
                  console.log("SAVED POI!");
              }
          });

    });
    testData.events.forEach(function(event) {
        db.run("INSERT OR IGNORE INTO Events(title, start, end, allDay, pointsOfInterest_id) VALUES (?,?,?,?,?)",
          [
              event['title'],
              event['start'],
              event['end'],
              event['allDay'],
              event['pointsOfInterest_id']
          ],
          function(err){
              if (err){
                  console.log(err);

              }
              else {
                  console.log("SAVED EVENT!");
              }
          });
    })
});

db.close();