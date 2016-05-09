angular.module('osmTestApp', ['osmTestApp.services', 'osmTestApp.directives', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ngCsv'])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $compile, $document, $uibModal, databaseService, iconService) {
      console.log("OSM-Test App running!");
      $scope.admin = true;
      $scope.formToggle = false;
      $scope.oldPOI = {};
      $scope.selectedPOI = null;
      $scope.POIs = [];
      databaseService.getConfig().then(function (res) {
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
      // TEST-ZONE ENDE

      // => marker add und delete handling inside group <=
      var markerGroup = L.layerGroup();

      // add one marker by click
      map.on('click', function newPoi(event) {
          if ($scope.tempMarker) {
              map.removeLayer($scope.tempMarker);
          }
          $scope.formToggle = true;
          $scope.$apply();
          $scope.tempMarker = L.marker(event.latlng, {draggable: 'true', icon: iconService.getIcon('red')}).addTo(map);
          $scope.tempMarker.on('dragend', function () {
              console.log("dragged");
              $scope.$apply();
          });
      });


      // Create POIs
      function createLayer(POIs) {
          markerGroup.clearLayers();
          POIs.forEach(function (POI) {
              var linkFn = $compile(
                '<div class="markerPopup"><span class="markerPopupTitle">' + POI.title + '</span>' +
                '<button class="btn btn-warning" ng-if="admin" ng-click="updateThis()"><span class="glyphicon glyphicon-pencil"></span></button>' +
                '<button class="btn btn-danger" ng-if="admin" ng-click="deleteThis()"><span class="glyphicon glyphicon-remove-circle"></span></button>' +
                '</div>'
              );
              var content = linkFn($scope);
              var marker = L.marker({'lat': POI.lat, 'lng': POI.lng});
              marker.bindPopup(content[0]).on("popupopen", function () {
                  var currentMarker = this;
                  $scope.deleteThis = function () {
                      databaseService.deletePOI(POI).then(function () {
                          updateView();
                      });
                  };
                  $scope.updateThis = function () {
                      $scope.oldPOI = POI;
                      if ($scope.tempMarker) {
                          map.removeLayer($scope.tempMarker);
                      }
                      $scope.formToggle = true;
                      $scope.tempMarker = L.marker({'lng': POI.lng, 'lat': POI.lat}, {draggable: 'true', icon: iconService.getIcon('red')}).addTo(map);
                  };
              });
              marker.on('click', function () {
                  $scope.selectedPOI = POI;
                  console.log("selected: ", $scope.selectedPOI);
                  $scope.$apply();
                  $scope.tempMarker.on('dragend', function () {
                      console.log("dragged");
                      $scope.$apply();
                  });
              });
              markerGroup.addLayer(marker);
          });
          map.addLayer(markerGroup);
      }

      $scope.savePOI = function (newPOI) {
          map.removeLayer($scope.tempMarker);
          console.log("Save newPoi", newPOI);
          databaseService.savePOI(newPOI).then(function () {
              $scope.formToggle = false;
              updateView();
          });
      };

      $scope.updatePOI = function (updatePoi) {
          map.removeLayer($scope.tempMarker);
          console.log("Update newPoi", updatePoi);
          databaseService.updatePOI(updatePoi).then(function () {
              $scope.formToggle = false;
              updateView();
          });
          $scope.oldPOI = {};
      };

      // close formular
      $scope.cancel = function () {
          console.log("CANCEL");
          map.removeLayer($scope.tempMarker);
          $scope.formToggle = false;
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

      $scope.csvExport = function () {
          return databaseService.getPOIJson();
      };

      // INITIALIZE
      updateView();
  })


  .controller('newPOICtrl', function ($scope, databaseService) {
      console.log($scope.oldPoi);
      $scope.poiHasDate = false;
      $scope.format = 'dd-MM-yyyy';
      $scope.popup = {'startDateOpen': false, 'endDateOpen': false};
      if (!$scope.oldPoi.id) {
          $scope.POI = {
              title: '',
              category: '',
              description: '',
              link: '',
              startDate: '',
              endDate: '',
              isEvent: false,
              imagePath: ''
          };
      } else {
          $scope.POI = $scope.oldPoi;
      }
      databaseService.getConfig().then(function (res) {
          $scope.config = res;
          Object.keys(res.rules).forEach(function (shortRule) {
              if (!$scope.POI[shortRule]) {
                  $scope.POI[shortRule] = ($scope.POI[shortRule] === 1);
              } else {
                  $scope.POI[shortRule] = false;
              }
          })
      });
      $scope.save = function (POI) {
          POI["lng"] = $scope.tempMarker.getLatLng().lng;
          POI["lat"] = $scope.tempMarker.getLatLng().lat;
          if (POI.id) {
              $scope.updatePoi(POI);
          } else {
              $scope.savePoi(POI);
          }
      };
  });



