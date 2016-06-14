angular.module('osmTestApp', ['ngAnimate', 'osmTestApp.services', 'osmTestApp.directives', 'osmTestApp.filters','ui.bootstrap', 'ui.bootstrap.datetimepicker', 'ui.calendar', 'ngCsv', 'ngCsvImport'])
  //use strict
  .controller('osmTestAppCtrl', function ($scope, $filter, $compile, $document, $uibModal, databaseService, iconService) {
      console.log("OSM-Test App running!");
      $scope.admin = false;
      $scope.formToggle = false; // show and hide new POI form
      $scope.oldPOI = {}; // save old poi variable on update
      $scope.selectedPOI = null; // currently selected Poi
      $scope.POIs = []; // list of all Pois
      $scope.redPOIs = $scope.POIs; // reduced POI Array
      $scope.status = {}; // active Marker status
      $scope.markers = [];
      $scope.bouncing = false;
      $scope.csvResult = null;
      $scope.eventSources = []; // calendar sources
      $scope.uiConfig = { calendar:{height: 450, editable: true, header:{ left: 'month basicWeek basicDay', center: 'title', right: 'today prev,next'}}};

      databaseService.getConfig().then(function (res) {
          $scope.config = res;
          console.log("Config:", res);
      });
      // OSM imports and settings
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});
      // create map with center in Karlsruhe
      var map = new L.Map('simpleMap'); // Map in <div> element mit dem Namen 'simpleMap' laden
      map.addLayer(osm); // Layer server hinzufügen
      map.setView(new L.LatLng(49.0148731, 8.4191506), 14); // Position laden
      var oststadtPolygon = new L.Polygon([
        [49.032341, 8.410995],
        [49.030878, 8.409208],
        [49.031036, 8.406261],
        [49.024135, 8.405470],
        [49.023624, 8.408443],
        [49.022804, 8.411058],
        [49.021658, 8.413355],
        [49.020194, 8.415371],
        [49.018671, 8.416851],
        [49.016889, 8.417884],
        [49.015198, 8.418408],
        [49.013408, 8.418305],
        [49.009692, 8.417744],
        [49.009265, 8.417463],
        [49.007416, 8.414452],
        [49.006118, 8.411237],
        [49.003231, 8.424315],
        [49.000134, 8.427045],
        [48.999807, 8.427696],
        [48.999539, 8.428768],
        [48.999297, 8.429776],
        [48.998845, 8.430439],
        [48.998225, 8.430733],
        [48.999606, 8.436155],
        [49.000167, 8.440455],
        [48.999313, 8.444972],
        [49.002804, 8.450292],
        [49.004218, 8.442420],
        [49.008300, 8.444492],
        [49.009505, 8.442552],
        [49.009330, 8.441991],
        [49.010116, 8.441021],
        [49.010828, 8.439516],
        [49.011623, 8.438610],
        [49.013614, 8.437564],
        [49.015665, 8.436147],
        [49.018033, 8.440741],
        [49.019028, 8.436568],
        [49.020451, 8.432384],
        [49.020961, 8.430853],
        [49.024893, 8.423720],
        [49.032331, 8.410987]
      ], {fill: true, fillOpacity:0.1, color: "red", clickable: false, weight: 2});
      map.addLayer(oststadtPolygon);

      // add one marker by click
      map.on('click', function newPoi(event) {
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

      // Create Marker out of POIs
      var markerGroup = L.layerGroup();
      function createLayer(POIs) {
          markerGroup.clearLayers();
          $scope.markers = [];
          POIs.forEach(function (POI) {
              var customIcon = iconService.getIcon($scope.config.categoryColors[POI.category] || 'blue', POI.isEvent);
              var linkFn = $compile(
                '<div class="markerPopup"><span class="markerPopupTitle">' + POI.title + '</span>' +
                '<button class="btn btn-warning" ng-if="admin" ng-click="updateThis()"><span class="glyphicon glyphicon-pencil"></span></button>' +
                '<button class="btn btn-danger" ng-if="admin" ng-click="deleteThis()"><span class="glyphicon glyphicon-remove-circle"></span></button>' +
                '</div>'
              );
              var content = linkFn($scope);
              var marker = L.marker({'lat': POI.lat, 'lng': POI.lng}, {icon: customIcon});
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
                  $scope.status[POI.id] = true;
                  console.log("selected: ", $scope.selectedPOI);
                  $scope.$apply();
                  if ($scope.tempMarker) {
                      $scope.tempMarker.on('dragend', function () {
                          console.log("dragged");
                          $scope.$apply();
                      });
                  }
              });
              marker.setBouncingOptions({
                  bounceHeight : 5,    // height of the bouncing
                  bounceSpeed  : 150    // bouncing speed coefficient
              });
              marker["POIid"] = POI.id;
              // Make current event bouncing
              marker["current"] = POI.status === "laufend" || POI.status === "";
              $scope.markers.push(marker);
              markerGroup.addLayer(marker);
          });
          map.addLayer(markerGroup);
      }

      $scope.currentMarkerBouncingToggle = function () {
          // Make current event bouncing
          $scope.bouncing = !$scope.bouncing;
          if ($scope.bouncing) {
              markerGroup.getLayers().forEach(function(marker) {
                  if (marker.current) {
                      marker.bounce();
                  }
              })
          } else {
              L.Marker.stopAllBouncingMarkers();
          }
      };

      $scope.selectPOI = function (POI) {
          $scope.selectedPOI = POI;
          $scope.markers.filter(function(marker) {
             return marker.POIid === POI.id;
          })[0].openPopup();
      };

      // CRUD-Handling
      // save poi and delete temporary marker
      $scope.savePOI = function (newPOI, events) {
          map.removeLayer($scope.tempMarker);
          databaseService.savePOI(newPOI).then(function (res) {
              $scope.formToggle = false;
              events.forEach(function(event) {
                  $scope.saveEvent(event, res.data.id);
              });
              updateCalendar();
              updateView();
          });
      };
      // update poi and delete temporary marker
      $scope.updatePOI = function (updatePoi, events) {
          map.removeLayer($scope.tempMarker);
          databaseService.updatePOI(updatePoi).then(function () {
              $scope.formToggle = false;
              events.forEach(function(event) {
                  $scope.saveEvent(event, updatePoi.id);
              });
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
              updateCalendar();
          });
      };
      // Neuen Termin anlegen
      $scope.saveEvent = function (event, poiID) {
          if (!event.id) {
              databaseService.saveEvent(event, poiID).then(function () {
                  updateCalendar();
              });
          }
      };
      // Termin löschen
      $scope.deleteEvent = function (event) {
          databaseService.deleteEvent(event).then(function () {
              updateCalendar();
          });
      };

      // Layer controls
      var overlay = {
          "Points of Interest": markerGroup,
          "Oststadt": oststadtPolygon
      };
      L.control.layers([], overlay, {position: 'bottomleft'}).addTo(map);

      // update view
      function updateView() {
          console.log("Update View!");
          databaseService.getPOIs().then(function (res) {
              $scope.POIs = res.data;
              createLayer($scope.POIs);
          });
      }
      function updateCalendar () {
          databaseService.getEvents().then(function (res) {
              $scope.eventSources[0] = {"events": res};
          });
      }
      // filter view
      $scope.filter = function (conditions) {
          $scope.redPOIs = $filter('poiFilter')($scope.POIs, conditions);
          createLayer($scope.redPOIs);
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
      updateCalendar();
  })


  .controller('newPOICtrl', function ($scope, $uibModal, databaseService) {
      console.log("Update ", $scope.oldPoi);
      $scope.events = [];
      databaseService.getEventsByKey($scope.oldPoi).then(function (res) {
          if (res) {
              console.log("Bisherige Events: ", res);
              $scope.events = res;
          }
      });
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
              hasEvents: false,
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
      
      $scope.addEvent = function () {
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'html/eventModal.html',
              size: "small",
              controller: function ($scope, $uibModalInstance) {
                  $scope.ok = function () {
                      $uibModalInstance.close($scope.newEvent);
                  };
                  $scope.cancel = function () {
                      $uibModalInstance.dismiss();
                  };
              },
              resolve: {
                  newEvent: function() {
                      return {
                          "title": "",
                          "start": "",
                          "end": "",
                          "editable": false,
                          "url": ""
                      }
                  }
              }
          });
          modalInstance.result.then(function (newEvent) {
              $scope.events.push(newEvent);
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };
      $scope.delete = function (event) {
          $scope.events.splice($scope.events.indexOf(event),1);
          $scope.deleteEvent(event);
      };
      
      $scope.save = function (POI) {
          POI["lng"] = $scope.tempMarker.getLatLng().lng;
          POI["lat"] = $scope.tempMarker.getLatLng().lat;
          if (POI.id) {
              $scope.updatePoi(POI, $scope.events);
          } else {
              $scope.savePoi(POI, $scope.events);
          }
      };
  });



