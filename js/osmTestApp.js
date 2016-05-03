angular.module('osmTestApp', ['osmTestApp.services', 'osmTestApp.directives', 'ui.bootstrap', 'ui.bootstrap.datetimepicker'])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $compile, $uibModal, databaseService) {
      console.log("OSM-Test App running!");
      $scope.admin = false;
      $scope.selectedPOI = null;
      databaseService.getConfig().then(function(res) {
          $scope.config = res;
          console.log(res);
      });
      // OSM imports and settings
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});
      // create map with center in Karlsruhe
      var map = new L.Map('simpleMap'); // Map in <div> element mit dem Namen 'simpleMap' laden
      map.addLayer(osm); // Layer server hinzufügen
      map.setView(new L.LatLng(49.0148731, 8.4191506), 14); // Position laden

      // TEST-ZONE
      // add circle
      var circle = L.circle([49.0148731, 8.43000], 100, {
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

      // icon type
      var qzIcon = L.icon({
          iconUrl: './img/b.png',
          iconSize:     [25, 40], // size of the icon
          shadowSize:   [40, 60], // size of the shadow
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      // TEST-ZONE ENDE

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
              marker.on('click', function() {
                  $scope.selectedPOI = m;
                  $scope.$apply();
              });
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

  .controller('newMarkerModalCtrl', function ($scope, $uibModalInstance, databaseService, lng, lat) {
      console.log("Modal Ctrl");
      $scope.poiHasDate = false;
      $scope.format = 'dd-MM-yyyy';
      $scope.popup = { 'startDateOpen': false, 'endDateOpen': false };

      $scope.marker = {
          markerName: '',
          category: '',
          lng: lng,
          lat: lat,
          description: '',
          link: '',
          startDate: '',
          endDate: '',
          isEvent: false,
          imagePath: ''
      };

      databaseService.getConfig().then(function(res) {
          $scope.config = res;
          Object.keys(res.rules).forEach(function(shortRule) {
              $scope.marker[shortRule] = false;
          })
      });

      $scope.ok = function (res) {
          console.log("Save Marker", res);
          $uibModalInstance.close(res);
      };
      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };
  })


;



