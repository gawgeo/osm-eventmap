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
      
      this.savePOI = function(POI) {
          var deferred = $q.defer();
          $http({
              url: '/savePointOfInterest',
              method: "POST",
              data: {
                  'title': POI.title,
                  'lng': POI.lng,
                  'lat': POI.lat,
                  'category': POI.category,
                  'description': POI.description,
                  'link': POI.link,
                  'startDate': POI.startDate,
                  'endDate': POI.endDate,
                  'isEvent': POI.isEvent,
                  'imagePath': POI.imagePath,
                  'R1': POI.R1,
                  'R2': POI.R2,
                  'R3': POI.R3,
                  'R4': POI.R4,
                  'R5': POI.R5,
                  'R6': POI.R6,
                  'R7': POI.R7,
                  'R8': POI.R8,
                  'R9': POI.R9,
                  'R10': POI.R10,
                  'R11': POI.R11,
                  'R12': POI.R12,
                  'R13': POI.R13,
                  'R14': POI.R14,
                  'R15': POI.R15
              }
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

      this.getPOIs = function () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getPointsOfInterest'
          }).success(function (data) {
              console.log("GET", data);
              deferred.resolve({'data': data});
          }).error(function () {
              window.alert("PointsOfInterest GET failure!");
          });
          return deferred.promise;
      };

      this.deletePOI = function(POI) {
          var deferred = $q.defer();
          $http({
              url: '/deletePointOfInterest',
              method: "POST",
              data: {'lng': POI.lng, 'lat': POI.lat}
          }).success(function () {
              console.log("Deleted", POI);
              deferred.resolve();
          }).error(function () {
              window.alert("PointsOfInterest delete failure!");
          });
          return deferred.promise;
      };

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
  })

  .service('iconService', function() {
      this.getIcon = function (color) {
          return newIcon = L.icon({
              iconUrl: './img/marker-icon-' + color + '.png',
              iconAnchor:   [13, 41], // point of the icon which will correspond to marker's location
              shadowAnchor: [20, 86],  // the same for the shadow
              popupAnchor:  [-3, -76], // point from which the popup should open relative to the iconAnchor
              shadowUrl: './img/marker-shadow.png',
              shadowSize: [68, 95]
          });
      }

  });