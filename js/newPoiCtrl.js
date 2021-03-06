var app = angular.module('osmApp.newPoiCtrl', [])

  .controller('newPOICtrl', function ($scope, $timeout, $uibModal, databaseService) {
      $scope.events = [];
      $scope.POI = {};
      $scope.popup = {'startDateOpen': false, 'endDateOpen': false};
      $scope.dateOptions = {
          format: 'DD.MM.YYYY HH:mm'
      };
      databaseService.getEventsByKey($scope.oldPoi).then(function (res) {
          if (res) {
              console.log("Bisherige Events: ", res);
              $scope.events = res;
          }
      });
      // Falls POI noch nicht existiert, lege neu an, sonst update von POI
      if (!$scope.oldPoi.id) {
          $scope.POI = {
              title: null,
              category: null,
              description: null,
              link: null,
              startdate: null,
              enddate: null,
              hasevents: false,
              imagepath: null
          };
      } else {
          $scope.POI = $scope.oldPoi;
      }
      databaseService.getConfig().then(function (res) {
          $scope.config = res;
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
                          "startdate": null,
                          "enddate": null,
                          "allday": false,
                          "link": null
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