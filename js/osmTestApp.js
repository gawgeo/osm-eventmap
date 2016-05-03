angular.module('osmTestApp', ['osmTestApp.services', 'osmTestApp.directives', 'ui.bootstrap', 'ui.bootstrap.datetimepicker'])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $compile, $uibModal, databaseService) {
      console.log("OSM-Test App running!");
      $scope.admin = false;
      $scope.selectedPOI = null;
      $scope.POIs = [];
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
      // add one marker by click
      map.on('click', function (event) {
          console.log(event);
          var tempMarker = L.marker(event.latlng, {draggable: 'true', icon: qzIcon}).addTo(map);

          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'html/newMarkerModal.html',
              controller: 'newMarkerModalCtrl',
              size: 'sm',
              backdrop: false,
              resolve: {
                  'tempMarker': tempMarker,
              }
          });
          modalInstance.result.then(function (newPOI) {
              map.removeLayer(tempMarker);
              databaseService.savePOI(newPOI).then(function() {
                  updateView();
              });
          }, function () {
              map.removeLayer(tempMarker);
              console.log('Modal dismissed at: ' + new Date());
          });
      });


      function createLayer(POIs) {
          markerGroup.clearLayers();
          POIs.forEach(function (POI) {
              var linkFn = $compile('<button ng-click="deleteThis()">Delete ' + POI.title + '</button>');
              var content = linkFn($scope);
              var marker = L.marker({'lng': POI.lng, 'lat': POI.lat});
              marker["title"] = POI.title;
              marker.bindPopup(content[0]).on("popupopen", function () {
                  var currentMarker = this;
                  $scope.deleteThis = function () {
                      $scope.deletePOI(currentMarker);
                  }
              });
              marker.on('click', function() {
                  $scope.selectedPOI = POI;
                  $scope.$apply();
              });
              markerGroup.addLayer(marker);
          });
          map.addLayer(markerGroup);
      }


      // delete one marker by popup
      $scope.deletePOI = function (POI) {
          console.log("Delete POI");
          databaseService.deletePOI({
              'title': POI.title,
              'lng': POI.getLatLng().lng,
              'lat': POI.getLatLng().lat
          }).then(function() {
              updateView();
          });
      };

      // delete all marker
      $scope.deleteAllPOIs = function () {
          databaseService.deleteAllPOIs().then(function () {
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
          databaseService.getPOIs().then(function (res) {
              $scope.POIs = res.data;
              createLayer($scope.POIs);
          });
      }

      // INITIALIZE
      updateView();
  })

  .controller('newMarkerModalCtrl', function ($scope, $uibModalInstance, databaseService, tempMarker) {
      console.log("Modal Ctrl", tempMarker);
      $scope.poiHasDate = false;
      $scope.format = 'dd-MM-yyyy';
      $scope.popup = { 'startDateOpen': false, 'endDateOpen': false };

      $scope.marker = {
          title: '',
          category: '',
          lng: tempMarker.getLatLng().lng,
          lat: tempMarker.getLatLng().lat,
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



