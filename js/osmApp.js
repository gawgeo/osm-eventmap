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
      'ui.bootstrap.datetimepicker',
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

  .controller('osmAppCtrl', function ($rootScope, $state, databaseService) {
      console.log("OSM-App running!");
      $state.go('home');

      databaseService.getConfig().then(function (res) {
          $rootScope.config = res;
          console.log("config loaded: ", $rootScope.config);
      });

  });



