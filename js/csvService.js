angular.module('osmApp.csvService', [])

  .service('csvService', ['databaseService', '$q', function (databaseService, $q) {
      // icon service delivering customized Icons
      this.csvPoiExport = function () {
          return databaseService.getPOIJson();
      };
      this.csvEventExport = function () {
          return databaseService.getEventsJson();
      };
      this.importPoiCsv = function (csv) {
          var importFinished = $q.defer();
          // find headlines (attribute identifiers)
          var newPois = [];
          if (csv) {
              csv.pop();
              var headers = csv.shift();
              var splittedHeaders = headers['0'].split(";");
              csv.forEach(function (poi) {
                  var splittedPoi = poi['0'].split(";");
                  var newPoi = {};
                  for (var i = 0; i < splittedHeaders.length; i++) {
                      newPoi[splittedHeaders[i]] = splittedPoi[i];
                  }
                  newPois.push(newPoi);
              })
          }
          // save POIs to Database
          var databasePromises = [];
          newPois.forEach(function (poi) {
              console.log("Import Poi: ", poi);
              var deferred = $q.defer();
              if (poi.lng && poi.lat) {
                  poi.lng = poi.lng.replace(/,/g, '.');
                  poi.lat = poi.lat.replace(/,/g, '.');
              }
              if (!poi.startdate) {
                  poi.startdate =  null;
              }
              if (!poi.enddate) {
                  poi.enddate =  null;
              }
              if (poi.id) {
                  databaseService.updatePOI(poi).then(function () {
                      console.log("updatePoi", poi);
                      deferred.resolve();
                  });
              } else if (poi.title) {
                  databaseService.savePOI(poi).then(function () {
                      console.log("savedPoi", poi);
                      deferred.resolve();
                  });
              }
              databasePromises.push(deferred);
          });
          $q.all(databasePromises).then(function () {
              importFinished.resolve();
          });
          return importFinished.promise;
      };
      this.importEventCsv = function (csv) {
          var importFinished = $q.defer();
          // find headlines (attribute identifiers)
          var newEvents = [];
          if (csv) {
              csv.pop();
              var headers = csv.shift();
              var splittedHeaders = headers['0'].split(";");
              csv.forEach(function (event) {
                  var splittedEvent = event['0'].split(";");
                  var newEvent = {};
                  for (var i = 0; i < splittedHeaders.length; i++) {
                      newEvent[splittedHeaders[i]] = splittedEvent[i];
                  }
                  newEvents.push(newEvent);
              });
          }
          var databasePromises = [];
          newEvents.forEach(function (event) {
              var deferred = $q.defer();
              if (!event.start) {
                  event.start =  null;
              }
              if (!event.end) {
                  event.end =  null;
              }
              databaseService.saveEvent(event, event["pointsOfInterest_id"]).then(function () {
                  deferred.resolve();
              });
              databasePromises.push(deferred);
          });
          $q.all(databasePromises).then(function () {
              importFinished.resolve();
          });
          return importFinished.promise;
      };
  }]);