angular.module('osmTestApp',
  [
      'ngAnimate',
      'osmTestApp.databaseService',
      'osmTestApp.csvService',
      'osmTestApp.seedService',
      'osmTestApp.iconService',
      'osmTestApp.directives',
      'osmTestApp.filters',
      'osmTestApp.mainCtrl',
      'osmTestApp.newPoiCtrl',
      'osmTestApp.adminCtrl',
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
            url: '/admin',
            templateUrl: '../html/mainAdmin.html'
        });
  })

  .controller('osmTestAppCtrl', function ($state) {
      console.log("OSM-App running!");
      $state.go('home');
  });



