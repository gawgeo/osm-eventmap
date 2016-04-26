angular.module('osmTestApp', ['osmTestApp.services', 'ui.bootstrap'])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $compile, $uibModal, databaseService) {
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
          console.log(event);
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'html/newMarkerModal.html',
              controller: 'newMarkerModalCtrl',
              size: 'sm',
              backdrop: false,
              resolve: {
                  'lng': event.latlng.lng,
                  'lat': event.latlng.lat
              }
          });
          modalInstance.result.then(function (res) {
              databaseService.saveMarker(res).then(function() {
                  updateView();
              });
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      });


      function createLayer(markers) {
          markerGroup.clearLayers();
          markers.forEach(function (m) {
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
          databaseService.deleteMarker({
              'markerName': thisMarker.markerName,
              'lng': thisMarker.getLatLng().lng,
              'lat': thisMarker.getLatLng().lat
          }).then(function() {
              updateView();
          });
      };

      // delete all marker
      $scope.deleteAllMarker = function () {
          databaseService.deleteAllMarker().then(function () {
              updateView();
          });
      };

      // Layer controls
      var overlay = {
          "polygon": polygon,
          "circle": circle,
          "marker": markerGroup
      };
      L.control.layers([], overlay, {position: 'topleft'}).addTo(map);

      // update view
      function updateView() {
          console.log("Update View!");
          databaseService.getMarkers().then(function (res) {
              $scope.markers = res.data;
              createLayer($scope.markers);
          });
      }

      // INITIALIZE
      updateView();
  })

  .controller('newMarkerModalCtrl', function ($scope, $uibModalInstance, lng, lat) {
      console.log("Modal Ctrl");
      $scope.marker = {
          markerName: 'Marker',
          lng: lng,
          lat: lat
      };
      $scope.ok = function (res) {
          $uibModalInstance.close(res);
      };
      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };
  });



