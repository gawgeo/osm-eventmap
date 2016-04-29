angular.module('osmTestApp.services', [])
  .service('databaseService', function($http, $q) {
      // server http communication --> capsule into service
      this.getConfig = function getConfig () {
          var deferred = $q.defer();
          $http.get('../config.json')
            .then(function(res){
                deferred.resolve(res.data);
                return res.data;
            });
          return deferred.promise;
      };
      
      this.saveMarker = function(marker) {
          var deferred = $q.defer();
          $http({
              url: '/saveMarker',
              method: "POST",
              data: {'markerName': marker.markerName, 'lng': marker.lng, 'lat': marker.lat}
          })
            .then(function (response) {
                  console.log("Marker saved!");
                  deferred.resolve();
              },
              function (response) { // optional
                  window.alert("Marker save Fehler!");
              });
          return deferred.promise;
      };

      this.getMarkers = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getMarkers'
          }).success(function (data) {
              console.log("GET", data);
              deferred.resolve({'data': data});
          }).error(function () {
              window.alert("Marker GET Fehler!");
          });
          return deferred.promise;
      };

      this.deleteMarker = function(marker) {
          var deferred = $q.defer();
          $http({
              url: '/deleteMarker',
              method: "POST",
              data: {'markerName': marker.markerName, 'lng': marker.lng, 'lat': marker.lat}
          }).success(function () {
              console.log("Deleted", marker);
              deferred.resolve();
          }).error(function () {
              window.alert("Marker Delete Fehler!");
          });
          return deferred.promise;
      };

      this.deleteAllMarker = function () {
          var deferred = $q.defer();
          $http({
              url: '/deleteAllMarker',
              method: "POST",
              data: {}
          }).success(function () {
              console.log("Deleted all Marker");
              deferred.resolve();
          }).error(function () {
              window.alert("Marker all delete Fehler!");
          });
          return deferred.promise;
      };
  });