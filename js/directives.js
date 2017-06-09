angular.module('osmApp.directives', [])
  .directive('draggable', function () {
      return {
          restrict: 'EA',
          link: function (scope, element) {
              //console.log("draggable!", element);
              element.draggable();
          }
      }
  })

  .directive('errSrc', function () {
      return {
          link: function (scope, element, attrs) {
              element.bind('error', function () {
                  if (attrs.src != attrs.errSrc) {
                      attrs.$set('src', attrs.errSrc);
                  }
              });
          }
      }
  })

  .directive('newPoi', function () {
      return {
          restrict: 'EA',
          controller: 'newPOICtrl',
          templateUrl: 'html/poiModal.html',
          scope: {
              'tempMarker': '=',
              'savePoi': '=',
              'updatePoi': '=',
              'cancel': '=',
              'oldPoi': '=',
              'saveEvent': '=',
              'deleteEvent': '='
          }
      }
  })

  .directive('scrollTop', function scrollTop($timeout) {
      return {
          restrict: 'A',
          link: function link(scope, element) {
              scope.collapsing = false;
              var jqElement = $(element);
              scope.$watch(function () {
                  return jqElement.find('.panel-collapse').hasClass('collapsing');
              }, function (status) {
                  if (scope.collapsing && !status) {
                    /*
                      if (jqElement.hasClass('panel-open')) {
                          console.log("ScrollOffset: ", jqElement.offset().top);
                          console.log(jqElement);
                          $('.pois').animate({
                              scrollTop: jqElement.offset().top - 50
                          }, 500);
                      }
                    */
                  }
                  scope.collapsing = status;
              });
          }
      };
  })

  .directive('validateBefore', function validateBefore() {
      return {
          restrict: 'A',
          require: '?ngModel',
          link: function ($scope, $element, $attrs, ngModel) {
              ngModel.$validators.validateBefore = function (modelValue) {
                  var compareTo = $scope.$eval($attrs.validateBefore).$viewValue;
                  if (!!modelValue) {
                      return modelValue.isBefore(compareTo);
                  } else {
                      return true;
                  }
              };
          }
      };
  })
  .directive('validateAfter', function validateAfter() {
      return {
          restrict: 'A',
          require: '?ngModel',
          link: function ($scope, $element, $attrs, ngModel) {
              ngModel.$validators.validateAfter = function (modelValue) {
                  console.log(modelValue);
                  var compareTo = $scope.$eval($attrs.validateAfter).$viewValue;
                  if (!!modelValue) {
                      return modelValue.isAfter(compareTo);
                  } else {
                      return true;
                  }
              };
          }
      };
  })

;




