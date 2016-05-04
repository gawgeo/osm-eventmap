var fs = require("fs");
var file = 'test.db';
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var sqliteJSON = require('sqlite-json');
var exporter = sqliteJSON(file);

db.serialize(function() {
    exporter.json('select * FROM PointsOfInterest', function (err, json) {
        if (err){
            console.log(err);

        }
        else {
            console.log(json);
        }
    });
});

db.close();