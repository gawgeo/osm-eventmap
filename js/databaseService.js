angular.module('osmApp.databaseService', [])

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
          }).then(function (res) {
              console.log("GET POIs", res.data);
              var now = Date.now();
              res.data.forEach(function (POI) {
                  var status = "laufend";
                  if (Date.parse(POI.startDate) >= now) {
                      status = "in Planung";
                  }
                  if (Date.parse(POI.endDate) <= now) {
                      status = "abgeschlossen";
                  }
                  if (Date.parse(POI.startDate) <= now && Date.parse(POI.endDate) >= now) {
                      status = "laufend";
                  }
                  POI["status"] = status;
              });
              deferred.resolve({'data': res.data});
          });
          return deferred.promise;
      };
      // GET-Request to get all POIs converted to JSON for better .csv-Export ability
      this.getPOIJson = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getPOIJson'
          }).then(function (data) {
              console.log("GET POIs JSON", data);
              deferred.resolve(data);
          });
          return deferred.promise;
      };
      // GET-Request to get all Events converted to JSON for better .csv-Export ability
      this.getEventsJson = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getEventsJson'
          }).then(function (data) {
              console.log("GET Events JSON", data);
              deferred.resolve(data);
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
          }).then(function () {
              console.log("Deleted", POI);
              deferred.resolve();
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
          }).then(function () {
              console.log("Deleted all PointsOfInterest");
              deferred.resolve();
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
          }).then(function (res) {
              console.log("GET", res);
              deferred.resolve(res.data);
          });
          return deferred.promise;
      };
      this.getEvents = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getAllEvents'
          }).then(function (res) {
              console.log("GET EVENTs", res.data);
              deferred.resolve(res.data);
          });
          return deferred.promise;
      };
      this.deleteEvent = function (Event) {
          var deferred = $q.defer();
          $http({
              url: '/deleteEvent',
              method: "POST",
              data: {'id': Event.id}
          }).then(function () {
              console.log("Deleted", Event);
              deferred.resolve();
          });
          return deferred.promise;
      };
      this.deleteEventsByKey = function (ForeignKey) {
          var deferred = $q.defer();
          $http({
              url: '/deleteEventsByKey',
              method: "POST",
              data: {'key': ForeignKey}
          }).then(function () {
              console.log("Deleted", Event);
              deferred.resolve();
          });
          return deferred.promise;
      };
      this.deleteAllEvents = function () {
          var deferred = $q.defer();
          $http({
              url: '/deleteAllEvents',
              method: "POST",
              data: {}
          }).then(function () {
              console.log("Deleted all Events");
              deferred.resolve();
          });
          return deferred.promise;
      };
  });