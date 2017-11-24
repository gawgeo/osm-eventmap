angular.module('osmApp.iconService', [])

  .service('iconService', function () {
      // icon service delivering customized Icons
      this.getIcon = function (color) {
          return newIcon = L.icon({
              iconUrl: './img/marker-icon-' + color + '.png',
              iconAnchor: [12.5, 41], // point of the icon which will correspond to marker's location
              shadowAnchor: [22, 93],  // the same for the shadow
              popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor
              iconSize: [35, 51],
              shadowUrl: './img/marker-shadow.png',
              shadowSize: [68, 95]
          });
      }
  });