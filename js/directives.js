angular.module('osmTestApp.directives', [])
  .directive('draggable', function(){
      return {
          restrict: 'EA',
          link: function(scope, element) {
              console.log("draggable!", element);
              element.draggable();
          }
      }
  })

  .directive('errSrc', function() {
      return {
          link: function(scope, element, attrs) {
              element.bind('error', function() {
                  if (attrs.src != attrs.errSrc) {
                      attrs.$set('src', attrs.errSrc);
                  }
              });
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
  })

  .directive('scrollTop', function scrollTop() {
      return {
          restrict: 'A',
          link: function link(scope, element) {
              console.log("SCROLL");
              scope.collapsing = false;
              var jqElement = $(element);
              scope.$watch(function () {
                  return jqElement.find('.panel-collapse').hasClass('collapsing');
              }, function (status) {
                  if (scope.collapsing && !status) {
                      if (jqElement.hasClass('panel-open')) {
                          $('html,body').animate({
                              scrollTop: jqElement.offset().top - 20
                          }, 500);
                      }
                  }
                  scope.collapsing = status;
              });

          }
      };
  });




