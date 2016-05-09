angular.module('osmTestApp.directives', [])
  .directive('uibModalWindow', function(){
      return {
          restrict: 'EA',
          link: function(scope, element) {
              console.log("draggable!", element);
              element.draggable();
          }
      }
  })

  .directive('newPoi', function(){
      return {
          restrict: 'EA',
          controller: 'newPOICtrl',
          templateUrl: 'html/poiModal.html',
          scope: {
              'tempMarker': '=',
              'savePoi': '=',
              'updatePoi': '=',
              'cancel': '=',
              'oldPoi': '='
          }
      }
  });
