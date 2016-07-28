angular.module('osmTestApp.services', [])

  .service('databaseService', function ($http, $q) {
      // config json where categories, rules and POI attributes are mentioned
      this.getConfig = function getConfig() {
          var deferred = $q.defer();
          $http.get('../config.json')
            .then(function (res) {
                deferred.resolve(res.data);
                return res.data;
            });
          return deferred.promise;
      };
      // POST-Request for new POI
      this.savePOI = function (POI) {
          var deferred = $q.defer();
          $http({
              url: '/savePointOfInterest',
              method: "POST",
              data: POI
          })
            .then(function (response) {
                  console.log("PointOfInterest saved!");
                  deferred.resolve(response);
              },
              function (response) { // optional
                  window.alert("PointOfInterest save failure!");
              });
          return deferred.promise;
      };
      // POST-Request for updating POI by ID
      this.updatePOI = function (POI) {
          var deferred = $q.defer();
          $http({
              url: '/updatePointOfInterest',
              method: "POST",
              data: POI
          })
            .then(function (response) {
                  console.log("PointOfInterest saved!");
                  deferred.resolve();
              },
              function (response) { // optional
                  window.alert("PointOfInterest save failure!");
              });
          return deferred.promise;
      };
      // GET-Request to get all POIs, status dynamically added
      this.getPOIs = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getPointsOfInterest'
          }).success(function (data) {
              console.log("GET POIs", data);
              var now = Date.now();
              data.forEach(function (POI) {
                  var status = "laufend";
                  if (Date.parse(POI.startDate) >= now) {
                      status = "in Planung";
                  }
                  if (Date.parse(POI.endDate) <= now) {
                      status = "abgelaufen";
                  }
                  if (Date.parse(POI.startDate) <= now && Date.parse(POI.endDate) >= now) {
                      status = "laufend";
                  }
                  POI["status"] = status;
              });
              deferred.resolve({'data': data});
          }).error(function () {
              window.alert("PointsOfInterest GET failure!");
          });
          return deferred.promise;
      };
      // GET-Request to get all POIs converted to JSON for better .csv-Export ability
      this.getPOIJson = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getPOIJson'
          }).success(function (data) {
              console.log("GET POIs JSON", data);
              deferred.resolve(data);
          }).error(function () {
              window.alert("POI-JSON GET failure!");
          });
          return deferred.promise;
      };
      // POST-Request to delete POI by id
      this.deletePOI = function (POI) {
          var deferred = $q.defer();
          $http({
              url: '/deletePointOfInterest',
              method: "POST",
              data: {'id': POI.id}
          }).success(function () {
              console.log("Deleted", POI);
              deferred.resolve();
          }).error(function () {
              window.alert("PointsOfInterest delete failure!");
          });
          return deferred.promise;
      };
      // POST-Request to delete all POIs
      this.deleteAllPOIs = function () {
          var deferred = $q.defer();
          $http({
              url: '/deleteAllPointsOfInterest',
              method: "POST",
              data: {}
          }).success(function () {
              console.log("Deleted all PointsOfInterest");
              deferred.resolve();
          }).error(function () {
              window.alert("PointsOfInterest all delete failure!");
          });
          return deferred.promise;
      };


      // Server Communication for EVENTS-Table
      this.saveEvent = function (Event, foreignKey) {
          Event["pointsOfInterest_id"] = foreignKey;
          var deferred = $q.defer();
          $http({
              url: '/saveEvent',
              method: "POST",
              data: Event
          })
            .then(function (response) {
                  console.log("Event saved!");
                  deferred.resolve();
              },
              function (response) { // optional
                  window.alert("PointOfInterest save failure!");
              });
          return deferred.promise;
      };
      this.getEventsByKey = function (POI) {
          console.log("getEventsByKey", POI.id);
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getEventsByKey',
              params: {'key': POI.id}
          }).success(function (data) {
              console.log("GET", data);
              deferred.resolve(data);
          }).error(function () {
              window.alert("Events GET failure!");
          });
          return deferred.promise;
      };
      this.getEvents = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getAllEvents'
          }).success(function (data) {
              console.log("GET EVENTs", data);
              deferred.resolve(data);
          }).error(function () {
              window.alert("Events GET failure!");
          });
          return deferred.promise;
      };
      this.deleteEvent = function (Event) {
          var deferred = $q.defer();
          $http({
              url: '/deleteEvent',
              method: "POST",
              data: {'id': Event.id}
          }).success(function () {
              console.log("Deleted", Event);
              deferred.resolve();
          }).error(function () {
              window.alert("Event delete failure!");
          });
          return deferred.promise;
      };
      this.deleteEventsByKey = function (ForeignKey) {
          var deferred = $q.defer();
          $http({
              url: '/deleteEventsByKey',
              method: "POST",
              data: {'key': ForeignKey}
          }).success(function () {
              console.log("Deleted", Event);
              deferred.resolve();
          }).error(function () {
              window.alert("Event delete failure!");
          });
          return deferred.promise;
      };
      this.deleteAllEvents = function () {
          var deferred = $q.defer();
          $http({
              url: '/deleteAllEvents',
              method: "POST",
              data: {}
          }).success(function () {
              console.log("Deleted all Events");
              deferred.resolve();
          }).error(function () {
              window.alert("Events all delete failure!");
          });
          return deferred.promise;
      };
  })

  .service('iconService', function () {
      // icon service delivering customized Icons
      this.getIcon = function (color) {
          return newIcon = L.icon({
              iconUrl: './img/marker-icon-' + color + '.png',
              iconAnchor: [12.5, 41], // point of the icon which will correspond to marker's location
              shadowAnchor: [22, 93],  // the same for the shadow
              popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor
              iconSize: [25, 41],
              shadowUrl: './img/marker-shadow.png',
              shadowSize: [68, 95]
          });
      }

  })

  .service('csvService', ['databaseService', '$q', function (databaseService, $q) {
      // icon service delivering customized Icons
      this.csvExport = function () {
          return databaseService.getPOIJson();
      };
      this.importCsv = function (csv) {
          var importFinished = $q.defer();
          // find POI headlines (attribute identifiers)
          var newPois = [];
          if (csv) {
              csv.pop();
              var headers = csv.shift();
              var splittedHeaders = headers['0'].split("\t");
              csv.forEach(function(poi) {
                  var splittedPoi = poi['0'].split("\t");
                  var newPoi = {};
                  for (var i = 0; i<splittedHeaders.length; i++) {
                      newPoi[splittedHeaders[i]] = splittedPoi[i];
                  }
                  newPois.push(newPoi);
              })
          }
          // save POIs to Database
          var databasePromises = [];
          newPois.forEach(function(poi) {
              var deferred = $q.defer();
              if (poi.lng && poi.lat) {
                  poi.lng = poi.lng.replace(/,/g, '.');
                  poi.lat = poi.lat.replace(/,/g, '.');
              }
              if (poi.id) {
                  databaseService.updatePOI(poi).then(function () {
                      deferred.resolve();
                      console.log("updatePoi", poi);
                  });
              } else {
                  databaseService.savePOI(poi).then(function () {
                      console.log("savedPoi", poi);
                      deferred.resolve();
                  });
              }
              databasePromises.push(deferred);
          });
          $q.all(databasePromises).then(function() {
              importFinished.resolve();
          });
          return importFinished.promise;
      };
  }]);