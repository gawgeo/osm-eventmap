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
                  deferred.resolve();
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
              console.log("GET", data);
              var today = Date.now();
              data.forEach(function (POI) {
                  var status = "kein Status";
                  console.log(today, Date.parse(POI.startDate), Date.parse(POI.endDate));
                  if (Date.parse(POI.startDate) <= today) {
                      status = "in Planung";
                  }
                  if (Date.parse(POI.endDate) <= today) {
                      status = "abgelaufen";
                  }
                  if (Date.parse(POI.startDate) <= today && Date.parse(POI.endDate) >= today) {
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
              console.log("GET", data);
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

  });