//Initialize DB
var fs = require("fs");
var file = 'test.db';

var testData = require('./testSeed');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    console.log("SEED DATABASE");
    testData.forEach(function(poi) {
        db.run("INSERT OR IGNORE INTO markers (markerName, lng, lat, category, description, link, isEvent, startDate, endDate, imagePath, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, R14, R15) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
              poi['markerName'],
              poi['lng'],
              poi['lat'],
              poi['category'],
              poi['description'],
              poi['link'],
              poi['isEvent'],
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
                  console.log("SAVED!");
              }
          });

    })
});

db.close();