var app = angular.module('osmTestApp.adminCtrl', [])

  .controller('adminCtrl', function ($scope, databaseService, csvService) {
      console.log("adminCtrl running!");


      // Seed
      $scope.seed = function () {
          seedService.seed().then(function() {
              $scope.updateView();
              $scope.updateCalendar();
          })
      };

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
              $scope.updateView();
          });
      });

      $scope.$watch("csvEventResult", function(res) {
          databaseService.deleteAllEvents().then(function() {
              csvService.importEventCsv(res).then(function() {
                  $scope.csvResult = null;
                  $scope.updateView();
                  $scope.updateCalendar();
              });
          });
      });
  });
