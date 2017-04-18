angular.module('osmApp.mainCtrl', [])

  .controller('mainCtrl', function ($scope, $filter, $compile, $document, $timeout, $uibModal, databaseService, iconService) {
      console.log("mainCtrl running!");
      // Variabels
      $scope.POIs = []; // list of all Pois
      $scope.admin = false; // Admin-Boolean toggle
      $scope.formToggle = false; // show and hide newPOI-Form
      $scope.oldPOI = {}; // save old poi variable on update
      $scope.selectedPOI = null; // currently selected Poi
      $scope.redPOIs = $scope.POIs; // reduced POI Array
      $scope.status = {}; // active Marker status
      $scope.markers = []; // Markers-Array
      $scope.bouncing = false; // Bouncing-Boolean
      $scope.conditions = { categories: [] };
      $scope.addNew = false;
      $scope.backLinkClick = function () {
          window.location.reload(false);
      };

      // Map in <div> element mit dem Namen 'simpleMap' laden
      //$scope.markerGroup = L.layerGroup();
      var map  = new L.Map('simpleMap');
      var markerGroup = L.markerClusterGroup();
      $scope.map = map;
      $scope.markerGroup = markerGroup;

      // CALENDAR settings
      $scope.eventSources = []; // calendar sources
      $scope.eventClick = function (date, event, view) {
          $scope.selectedPOI = $scope.POIs.find(function (POI) {
              return POI.id === date.pointsOfInterest_id;
          });
          $scope.markers.filter(function(marker) {
              return marker.POIid === $scope.selectedPOI.id;
          })[0].openPopup();
          $scope.status[$scope.selectedPOI.id] = true;
      };
      $scope.eventRender = function(date, element, view ) {
          var msgText = $scope.POIs.find(function (POI) {
              return POI.id === date.pointsOfInterest_id;
          }).title;
          element.tooltip({ //oder Popover?
              title: date.title + " von: " + msgText,
              placement: 'top'
              //content: "von:" + msgText
          });
      };
      $scope.uiConfig = { calendar:{height: 450, editable: false, theme:false, eventClick: $scope.eventClick, eventRender:$scope.eventRender, lang:'de', header:{ left: 'month basicWeek basicDay', center: 'title', right: 'today prev,next'}}};

      // Map-Funktionalität
      map.on('click', function newPoi(event) {
          if ($scope.addNew === false) {return;}
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
      function createLayer(POIs) {
          markerGroup.clearLayers();
          $scope.markers = [];
          POIs.forEach(function (POI) {
              var customIcon = iconService.getIcon($scope.config.categoryColors[POI.category] || 'qz-blue', POI.hasEvents);
              var linkFn = $compile(
                '<div class="markerPopup"><span class="markerPopupTitle">' + POI.title + '</span>' +
                '<span class="markerPopup">' + POI.description + '</span>' +
                '<div class="markerPopupAddDate"><button class="btn btn-link" ng-click="newSingleEvent('+ POI.id +')"><span class="glyphicon glyphicon-plus"></span><span>Termin hinzufügen</span></button>' +
                '<button class="btn btn-warning pull-right" ng-if="$parent.admin" ng-click="updateThis()"><span class="glyphicon glyphicon-pencil"></span></button>' +
                '<button class="btn btn-danger pull-right" ng-if="$parent.admin" ng-click="deleteThis()"><span class="glyphicon glyphicon-remove-circle"></span></button></div>' +
                '</div>'
              );
              var content = linkFn($scope);
              var marker = L.marker({'lat': POI.lat, 'lng': POI.lng}, {icon: customIcon});
              marker.bindPopup(content[0]).on("popupopen", function () {
                  var currentMarker = this;
                  $scope.deleteThis = function () {
                      databaseService.deleteEventsByKey(POI.id).then(function() {
                          databaseService.deletePOI(POI).then(function () {
                              $scope.updateView();
                              $scope.updateCalendar();
                          });
                      });
                  };
                  $scope.updateThis = function () {
                      $scope.oldPOI = POI;
                      if ($scope.tempMarker) {
                          map.removeLayer($scope.tempMarker);
                      }
                      $scope.formToggle = true;
                      $scope.tempMarker = L.marker({'lng': POI.lng, 'lat': POI.lat}, {draggable: 'true', icon: iconService.getIcon('qz-red')}).addTo(map);
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
      //Enable Bootstrap Tooltip
      $(function () {
          $('[data-toggle="tooltip"]').tooltip()
      });

      // Make current POI-Marker bouncing
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

      // Cross-Select POI (in Calendar, Marker, Accordion)
      $scope.selectPOI = function (POI) {
          $scope.selectedPOI = POI;
          $scope.markers.filter(function(marker) {
              return marker.POIid === POI.id;
          })[0].openPopup();
      };

      // CRUD-Handling with Database
      // save poi and delete temporary marker
      $scope.savePOI = function (newPOI, events) {
          map.removeLayer($scope.tempMarker);
          databaseService.savePOI(newPOI).then(function (res) {
              $scope.formToggle = false;
              events.forEach(function(event) {
                  console.log("type of ", typeof (res.data.id));
                  $scope.saveEvent(event, res.data.id);
              });
              $scope.updateCalendar();
              $scope.updateView();
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
              $scope.updateView();
          });
          $scope.oldPOI = {};
      };

      // close addPOI-form
      $scope.cancel = function () {
          map.removeLayer($scope.tempMarker);
          $scope.formToggle = false;
      };

      // Neuen Termin anlegen
      $scope.saveEvent = function (event, poiID) {
          if (!event.id) {
              databaseService.saveEvent(event, poiID).then(function () {
                  $scope.updateView();
                  $scope.updateCalendar();
              });
          }
      };

      // Neues Termin Model über Popup
      $scope.newSingleEvent = function (POIid) {
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
                          "allDay": false,
                          "url": ""
                      }
                  }
              }
          });
          modalInstance.result.then(function (newEvent) {
              newEvent.link = "http://" + newEvent.link;
              $scope.saveEvent(newEvent, POIid);
              console.log("Save new Event", newEvent, POIid);
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };

      // Termin löschen
      $scope.deleteEvent = function (event) {
          databaseService.deleteEvent(event).then(function () {
              $scope.updateCalendar();
          });
      };

      // filter view
      $scope.setCatCondition = function (categoryCondition) {
          if ($scope.conditions.categories.indexOf(categoryCondition) != -1) {
              $scope.conditions.categories.splice($scope.conditions.categories.indexOf(categoryCondition),1)
          } else {
              $scope.conditions.categories.push(categoryCondition)
          }
          $scope.filter($scope.conditions);
      };
      $scope.filter = function (conditions) {
          console.log(conditions);
          $scope.redPOIs = $filter('poiFilter')($scope.POIs, conditions);
          console.log($scope.redPOIs);
          createLayer($scope.redPOIs);
      };

      // update view
      $scope.updateView = function () {
          databaseService.getPOIs().then(function (res) {
              $scope.POIs = res.data;
              createLayer($scope.POIs);
          });
      };
      $scope.updateCalendar = function () {
          databaseService.getEvents().then(function (res) {
              $scope.eventSources[0] = {"events": res};
          });
      };
      $scope.$on('update-view', function(event, args) {
          console.log("Update View!");
          $scope.updateView();
          $scope.updateCalendar();
      });

      // INITIALIZE
      $scope.updateView();
      $scope.updateCalendar();
  });