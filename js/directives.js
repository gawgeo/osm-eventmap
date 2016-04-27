angular.module('osmTestApp.directives', [])
  .directive('uibModalWindow', function(){
      return {
          restrict: 'EA',
          link: function(scope, element) {
              console.log("draggable!", element);
              element.draggable();
          }
      }
  });
