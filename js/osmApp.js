angular.module('osmApp',
  [
      'ngAnimate',
      'osmApp.databaseService',
      'osmApp.csvService',
      'osmApp.seedService',
      'osmApp.iconService',
      'osmApp.directives',
      'osmApp.filters',
      'osmApp.mainCtrl',
      'osmApp.newPoiCtrl',
      'osmApp.adminCtrl',
      'osmApp.mapCtrl',
      'ui.router',
      'ui.bootstrap',
      'ae-datetimepicker',
      'ui.calendar',
      'ngCsv',
      'ngCsvImport'
  ]
)
  .config(function ($stateProvider) {
      $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '../html/main.html'
        })

        .state('admin', {
            url: '/qz-admin',
            templateUrl: '../html/mainAdmin.html'
        });
  })

  .controller('osmAppCtrl', function ($rootScope, $scope, $state, $uibModal, databaseService) {
      console.log("OSM-App running!");
      $state.go('home');

      $rootScope.format = 'dd.MM.yy H:mm';


      // Impressum modal
      $scope.openImpressumModal = function () {
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'html/impressumModal.html',
              size: "large",
              controller: function ($scope, $uibModalInstance) {
                  $scope.cancel = function () {
                      $uibModalInstance.dismiss();
                  };
              }
          });
          modalInstance.result.then(function () {
              console.log("Model closed");
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };

      databaseService.getConfig().then(function (res) {
          $rootScope.config = res;
          $rootScope.datetimeFormat = res.datetimeFormat;
          console.log("config loaded: ", $rootScope.config);
      });

  });



