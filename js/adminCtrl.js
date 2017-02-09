var app = angular.module('osmApp.adminCtrl', [])

  .controller('adminCtrl', function ($rootScope, $scope, databaseService, csvService, seedService) {
      console.log("adminCtrl running!");
      $scope.csvPoiResult = null; // csv-Import Variable
      $scope.csvEventResult = null; // csv-Import Variable

      // CSV-Export
      $scope.csvPoiExport = function () {
          return csvService.csvPoiExport();
      };
      $scope.csvEventExport = function () {
          return csvService.csvEventExport();
      };
      // CSV-Import
      $scope.$watch("csvPoiResult", function(res) {
          csvService.importPoiCsv(res).then(function() {
              $scope.csvResult = null;
              broadcast();
          });
      });

      $scope.$watch("csvEventResult", function(res) {
          if ($scope.csvEventResult) {
              databaseService.deleteAllEvents().then(function() {
                  csvService.importEventCsv(res).then(function() {
                      $scope.csvResult = null;
                      broadcast();
                  });
              });
          }
      });

      // Seed
      $scope.seed = function () {
          seedService.seed().then(function() {
              console.log("SEED FINISHED");
              broadcast();
          })
      };

      // delete all marker
      $scope.deleteAllPOIs = function () {
          databaseService.deleteAllEvents().then(function() {
              databaseService.deleteAllPOIs().then(function () {
                  broadcast();
              });
          });
      };

      function broadcast () {
          $rootScope.$broadcast('update-view');
      }
  });
