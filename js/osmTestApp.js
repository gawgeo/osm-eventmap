angular.module('osmTestApp', ['ngAnimate', 'osmTestApp.services', 'osmTestApp.directives', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ngCsv', 'ngCsvImport'])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $filter, $compile, $document, $uibModal, databaseService, iconService) {
      console.log("OSM-Test App running!");
      $scope.condition = '';
      $scope.admin = true;
      $scope.formToggle = false; // show and hide new POI form
      $scope.oldPOI = {}; // save old poi variable on update
      $scope.selectedPOI = null; // currently selected Poi
      $scope.POIs = []; // list of all Pois
      $scope.markers = [];
      $scope.csvResult = null;
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



      // add one marker by click
      map.on('dblClick', function newPoi(event) {
          if ($scope.tempMarker) {
              map.removeLayer($scope.tempMarker);
          }
          $scope.formToggle = true;
          $scope.$apply();
          $scope.tempMarker = L.marker(event.latlng, {draggable: 'true', icon: iconService.getIcon('red')}).addTo(map);
          if ($scope.tempMarker) {
              $scope.tempMarker.on('dragend', function () {
                  console.log("dragged");
                  $scope.$apply();
              });
          }
      });

      // Create POIs
      // => marker add und delete handling inside group <=
      var markerGroup = L.layerGroup();
      function createLayer(POIs) {
          markerGroup.clearLayers();
          $scope.markers = [];
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
                  if ($scope.tempMarker) {
                      $scope.tempMarker.on('dragend', function () {
                          console.log("dragged");
                          $scope.$apply();
                      });
                  }
              });
              marker["POIid"] = POI.id;
              $scope.markers.push(marker);
              markerGroup.addLayer(marker);
          });
          map.addLayer(markerGroup);
      }

      $scope.selectPOI = function (POI) {
          $scope.selectedPOI = POI;
          $scope.markers.filter(function(marker) {
             return marker.POIid === POI.id;
          })[0].openPopup();
      };

      // CRUD-Handling
      // save poi and delete temporary marker
      $scope.savePOI = function (newPOI) {
          map.removeLayer($scope.tempMarker);
          databaseService.savePOI(newPOI).then(function () {
              $scope.formToggle = false;
              updateView();
          });
      };
      // update poi and delete temporary marker
      $scope.updatePOI = function (updatePoi) {
          map.removeLayer($scope.tempMarker);
          databaseService.updatePOI(updatePoi).then(function () {
              $scope.formToggle = false;
              updateView();
          });
          $scope.oldPOI = {};
      };
      // close addPOI-form
      $scope.cancel = function () {
          map.removeLayer($scope.tempMarker);
          $scope.formToggle = false;
      };
      // delete all marker
      $scope.deleteAllPOIs = function () {
          databaseService.deleteAllPOIs().then(function () {
              updateView();
          });
      };



      // Layer controls - maybe delete later
      var overlay = {
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
      $scope.filter = function (condition) {
          /*createLayer($scope.POIs.filter(function(POI) {
              console.log("Filter View!", condition);
              return POI.title === condition;
          }));*/
          createLayer($filter('filter')($scope.POIs, condition));
      };


      // CSV-Import and Export
      $scope.csvExport = function () {
          return databaseService.getPOIJson();
      };
      
      $scope.$watch("csvResult", function(res) {
          console.log("new Upload", res);
          var newPois = [];
          if (res) {
              res.pop();
              var headers = res.shift();
              var splittedHeaders = headers['0'].split(";");
              res.forEach(function(poi) {
                  var splittedPoi = poi['0'].split(";");
                  var newPoi = {};
                  for (var i = 0; i<splittedHeaders.length; i++) {
                      newPoi[splittedHeaders[i]] = splittedPoi[i];
                  }
                  newPois.push(newPoi);
              })
          }
          newPois.forEach(function(poi) {
              if (poi.lng && poi.lat) {
                  poi.lng = poi.lng.replace(/,/g, '.');
                  poi.lat = poi.lat.replace(/,/g, '.');
              }
              console.log("savePoi", poi);
              if (poi.id) {
                  databaseService.updatePOI(poi).then(function () {
                      updateView();
                  });
              } else {
                  databaseService.savePOI(poi).then(function () {
                      updateView();
                  });
              }
          });
          $scope.csvResult = null;
      });

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



