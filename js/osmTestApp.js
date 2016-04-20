angular.module('osmTestApp', [])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $compile, $http) {
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

      // add one marker by click
      map.on('click', function (event) {
          var linkFn = $compile('<button ng-click="deleteThis()">Delete!</button>');
          var content = linkFn($scope);
          var marker = L.marker(event.latlng);


          marker.bindPopup(content[0]).on("popupopen", function () {
              var currentMarker = this;
              $scope.deleteThis = function () {
                  $scope.deleteMarker(currentMarker);
              }
          });
          markerGroup.addLayer(marker);
          console.log("Marker added: ", marker);
          map.addLayer(markerGroup);
          updateView();
      });




      // delete one marker by popup
      $scope.deleteMarker = function (thisMarker) {
          markerGroup.removeLayer(thisMarker);
      };

      // delete all marker
      $scope.clearMarker = function () {
          markerGroup.clearLayers();
      };

      // delete all layers
      $scope.clear = function () {
          map.removeLayer(polygon).removeLayer(circle);
          $scope.clearMarker();
      };

      // update view
      function updateView() {
          $scope.$apply();
      }

      // Layer controls
      var overlay = {
          "polygon": polygon,
          "circle": circle,
          "marker": markerGroup
      };
      L.control.layers([], overlay).addTo(map);


      // Scope variables für außerhalb der Map
      $scope.layers = map._layers; //Übersicht über alle Layer der map
      $scope.markers = markerGroup._layers;


      $scope.saveMarker = function (marker) {
          saveMarker({'markerName': 'Test', 'lng': 123.4532, 'lat': 1324.324});
      };

      $scope.getMarkers = function () {
          var markers = [];
          $scope.markers = getMarkers();
      };

      $scope.deleteMarker = function () {
          deleteMarker({'markerName': 'Test', 'lng': 123.4532, 'lat': 1324.324});
      };

      // server http communication
      function saveMarker(marker) {
          $http({
              url: '/saveMarker',
              method: "POST",
              data: {'markerName': marker.markerName, 'lng': marker.lng, 'lat': marker.lat}
          })
            .then(function (response) {
                  window.alert("Marker saved!");
              },
              function (response) { // optional
                  window.alert("Marker save Fehler!");
              });
      }

      function getMarkers () {
          $http({
              method: 'GET',
              url: '/getMarkers',
          }).success(function(data){
              console.log(data);
              return data
          }).error(function(){
              window.alert("Marker GET Fehler!");
          });
      }

      function deleteMarker (marker) {
          $http({
              url: '/deleteMarker',
              method: "POST",
              data: {'markerName': marker.markerName, 'lng': marker.lng, 'lat': marker.lat}
          })
            .then(function (response) {
                  window.alert("Marker deleted!");
              },
              function (response) { // optional
                  window.alert("Marker delete Fehler!");
              });
      }
  });

