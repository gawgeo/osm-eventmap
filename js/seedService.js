angular.module('osmApp.seedService', [])

  .service('seedService', ['$http', '$q', 'databaseService', function ($http, $q, databaseService) {
      this.seed = function () {
          return $http.get('./TestSeed.json').then(function (response) {
              var testData = response.data;
              console.log("SEED DATABASE", testData);
              var seedFinished = $q.defer();
              var databasePromises = [];
              testData.pois.forEach(function (poi) {
                  var deferred = $q.defer();
                  databaseService.savePOI(poi).then(function () {
                      //console.log("savedPoi", poi);
                      deferred.resolve();
                  });
                  databasePromises.push(deferred);
              });
              testData.events.forEach(function (event) {
                  var deferred = $q.defer();
                  databaseService.saveEvent(event, event.pointsOfInterest_id).then(function () {
                      //console.log("savedEvent", event);
                      deferred.resolve();
                  });
                  databasePromises.push(deferred);
              });
              $q.all(databasePromises).then(function () {
                  seedFinished.resolve();
              });
              return seedFinished.promise;
          });
      }
  }]);