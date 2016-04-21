angular.module('osmTestApp', [])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $compile, $http, $q) {
      console.log("OSM-Test App running!");
      // OSM imports and settings
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});
      // create map with center in Karlsruhe
      var map = new L.Map('simpleMap'); // Map in <div> element mit dem Namen 'simpleMap' laden
      map.addLayer(osm); // Layer server hinzufügen
      map.setView(new L.LatLng(49.0148731, 8.4191506), 14); // Position laden


      // add circle
      var circle = L.circle([49.0148731, 8.43000], 500, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5
      });
      map.addLayer(circle);
      // add polygon
      var polygon = L.polygon([
          [49.005, 8.41000],
          [49.013, 8.42000]
      ]);
      map.addLayer(polygon);

      // => marker add und delete handling inside group <=
      var markerGroup = L.layerGroup();
      $scope.marker = [];

      // add one marker by click
      map.on('click', function (event) {
          var m = {
              'markerName' : "Marker" + $scope.markers.length,
              'lng' : event.latlng.lng,
              'lat' : event.latlng.lat
            };
          saveMarker(m);
          updateView();
      });


      function createLayer (markers) {
          markerGroup.clearLayers();
          markers.forEach(function(m) {
              var linkFn = $compile('<button ng-click="deleteThis()">Delete ' + m.markerName + '</button>');
              var content = linkFn($scope);
              var marker = L.marker({'lng': m.lng, 'lat': m.lat});
              marker.bindPopup(content[0]).on("popupopen", function () {
                  var currentMarker = this;
                  $scope.deleteThis = function () {
                      $scope.deleteMarker(currentMarker);
                  }
              });
              marker["markerName"] = m.markerName;
              markerGroup.addLayer(marker);
          });
          map.addLayer(markerGroup);
      }


      // delete one marker by popup
      $scope.deleteMarker = function (thisMarker) {
          console.log("Delete Marker");
          deleteMarker({'markerName': thisMarker.markerName, 'lng': thisMarker.getLatLng().lng, 'lat': thisMarker.getLatLng().lat});
          updateView();
      };

      // delete all marker
      $scope.deleteAllMarker = function () {
          deleteAllMarker();
          updateView();
      };


      // Layer controls
      var overlay = {
          "polygon": polygon,
          "circle": circle,
          "marker": markerGroup
      };
      L.control.layers([], overlay).addTo(map);

      // update view
      function updateView() {
          console.log("Update View!");
          getMarkers().then(function(res) {
              $scope.markers = res.data;
              createLayer($scope.markers);
          });
      }

      // server http communication --> capsule into service
      function saveMarker(marker) {
          $http({
              url: '/saveMarker',
              method: "POST",
              data: {'markerName': marker.markerName, 'lng': marker.lng, 'lat': marker.lat}
          })
            .then(function (response) {
                  console.log("Marker saved!");
              },
              function (response) { // optional
                  window.alert("Marker save Fehler!");
              });
      }

      function getMarkers () {
          var deferred = $q.defer();
          $http({
              method: 'GET',
              url: '/getMarkers'
          }).success(function(data){
              console.log("GET", data);
              deferred.resolve({'data': data});
          }).error(function(){
              window.alert("Marker GET Fehler!");
          });
          return deferred.promise;
      }

      function deleteMarker (marker) {
          $http({
              url: '/deleteMarker',
              method: "POST",
              data: {'markerName': marker.markerName, 'lng': marker.lng, 'lat': marker.lat}
          })
            .then(function (response) {
                  console.log("Marker deleted!");
              },
              function (response) { // optional
                  window.alert("Marker delete Fehler!");
              });
      }

      function deleteAllMarker () {
          $http({
              url: '/deleteAllMarker',
              method: "POST",
              data: {}
          })
            .then(function (response) {
                  console.log("All Marker deleted!");
              },
              function (response) { // optional
                  window.alert("All Marker delete Fehler!");
              });
      }

      // INITIALIZE
      getMarkers().then(function(res) {
          $scope.markers = res.data;
          createLayer($scope.markers);
      });
  });

