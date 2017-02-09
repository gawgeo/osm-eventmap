var app = angular.module('osmApp.mapCtrl', [])

  .controller('mapCtrl', function ($scope) {
      console.log("mapCtrl running!");
      var map = $scope.$parent.map;
      var markerGroup = $scope.$parent.markerGroup;

      map.setView(new L.LatLng(49.0148731, 8.4191506), 14); // Position laden

      // OPEN STREET MAPS imports and settings
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});

      //zusäzliche Hintergrundkarte hizufügen. Auf Attribution achten! // Layer control einfügen!
      var map2Url = 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
      var map2Attrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var map2 = new L.TileLayer(map2Url, {minZoom: 5, maxZoom: 18, attribution: map2Attrib});

      //zusätzliche Hintergrundkarte hizufügen. Auf Attribution achten! // Layer control einfügen!
      var map3Url = 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png';
      var map3Attrib = 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      var map3 = new L.TileLayer(map3Url, {minZoom: 5, maxZoom: 18, attribution: map3Attrib});

      //zusätzliche Hintergrundkarte hizufügen. Auf Attribution achten! // Layer control einfügen!
      var map4Url = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
      var map4Attrib = 'Map tiles by <a href="http://stamen.com" target="_blank">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      var map4 = new L.TileLayer(map4Url, {minZoom: 5, maxZoom: 18, attribution: map4Attrib});

      //zusätzliche Hintergrundkarte hizufügen. Auf Attribution achten! // Layer control einfügen!
      var map5Url = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      var map5Attrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      var map5 = new L.TileLayer(map5Url, {minZoom: 5, maxZoom: 18, attribution: map5Attrib});

      map.addLayer(map3); // Layer server hinzufügen

      // Oststadt-Polygon
      var oststadtPolygon = new L.Polygon([
          [49.032341, 8.410995],
          [49.030878, 8.409208],
          [49.031036, 8.406261],
          [49.024135, 8.405470],
          [49.023624, 8.408443],
          [49.022804, 8.411058],
          [49.021658, 8.413355],
          [49.020194, 8.415371],
          [49.018671, 8.416851],
          [49.016889, 8.417884],
          [49.015198, 8.418408],
          [49.013408, 8.418305],
          [49.009692, 8.417744],
          [49.009265, 8.417463],
          [49.007416, 8.414452],
          [49.006118, 8.411237],
          [49.003231, 8.424315],
          [49.000134, 8.427045],
          [48.999807, 8.427696],
          [48.999539, 8.428768],
          [48.999297, 8.429776],
          [48.998845, 8.430439],
          [48.998225, 8.430733],
          [48.999606, 8.436155],
          [49.000167, 8.440455],
          [48.999313, 8.444972],
          [49.002804, 8.450292],
          [49.004218, 8.442420],
          [49.008300, 8.444492],
          [49.009505, 8.442552],
          [49.009330, 8.441991],
          [49.010116, 8.441021],
          [49.010828, 8.439516],
          [49.011623, 8.438610],
          [49.013614, 8.437564],
          [49.015665, 8.436147],
          [49.018033, 8.440741],
          [49.019028, 8.436568],
          [49.020451, 8.432384],
          [49.020961, 8.430853],
          [49.024893, 8.423720],
          [49.032331, 8.410987]
      ], {
          fill: false, color: "red",
          clickable: false,
          weight: 2});
      map.addLayer(oststadtPolygon);

      // Geocoder
      var osmGeocoder = new L.Control.OSMGeocoder({
          collapsed: true,
          position: 'topleft',
          text: 'Adresse suchen'
      });
      osmGeocoder.addTo(map);

      // Locate-Tool
      L.control.locate({
          options: {
              drawCircle: false,
              showPopup: false
          },
          strings: {
              title: "Finde meine Position!"
          }
      }).addTo(map);

      // Layer controls
      var baseMaps = {
          "Hydda": map3,
          "Open Street Map": osm,
          "Satellitenbild": map5
      };
      var overlay = {
          "Points of Interest": markerGroup,
          "Grenze der Oststadt": oststadtPolygon
      };
      L.control.layers(baseMaps, overlay, {
          position: 'bottomleft'
      }).addTo(map);
  });
