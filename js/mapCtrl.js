var app = angular.module('osmApp.mapCtrl', [])

  .controller('mapCtrl', function ($scope) {
      console.log("mapCtrl running!");
      var map = $scope.$parent.map;
      var markerGroup = $scope.$parent.markerGroup;

      map.setView(new L.LatLng(49.0109622707, 8.4299737215), 15); // Position laden

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

      // Oststadt-Polygon
      var hauptfriedhofPolygon = new L.Polygon([

          [49.0147582, 8.4287731],
          [49.0150273, 8.4279717],
          [49.0150481, 8.427901],
          [49.0150445, 8.4278016],
          [49.0157008, 8.4276872],
          [49.0157034, 8.4277187],
          [49.0160561, 8.4276516],
          [49.0160588, 8.4276751],
          [49.0163297, 8.4276328],
          [49.0163253, 8.4275859],
          [49.0166846, 8.4275054],
          [49.0171375, 8.4274477],
          [49.0180189, 8.4273184],
          [49.0185313, 8.4298984],
          [49.0185653, 8.4298834],
          [49.0187952, 8.430947],
          [49.0196419, 8.4316615],
          [49.0197954, 8.4316247],
          [49.0198049, 8.4317044],
          [49.0198103, 8.4317624],
          [49.0198236, 8.431897],
          [49.0202311, 8.4322534],
          [49.0203397, 8.4323615],
          [49.020017, 8.433543],
          [49.0194823, 8.4350974],
          [49.0194438, 8.4350613],
          [49.0192079, 8.4357251],
          [49.0189694, 8.4364088],
          [49.0189528, 8.4364565],
          [49.01893, 8.4365203],
          [49.0189538, 8.4365364],
          [49.0188165, 8.4369964],
          [49.0187136, 8.4373142],
          [49.0185957, 8.4377476],
          [49.0185047, 8.4380673],
          [49.018379, 8.4385126],
          [49.0183009, 8.4387971],
          [49.018202, 8.4391623],
          [49.0172729, 8.4381798],
          [49.0165549, 8.4372469],
          [49.0164485, 8.4373436],
          [49.0160775, 8.4364952],
          [49.0158262, 8.4359026],
          [49.0156317, 8.4354438],
          [49.0153431, 8.4347462],
          [49.0151085, 8.4341571],
          [49.0147899, 8.4331584],
          [49.0142702, 8.4312344],
          [49.0149017, 8.4307916],
          [49.014794, 8.430442],
          [49.0147892, 8.4304451],
          [49.0146976, 8.4301155],
          [49.0146853, 8.4301235],
          [49.0146534, 8.4300089],
          [49.0146496, 8.4299952],
          [49.0146615, 8.4299875],
          [49.0146242, 8.4298534],
          [49.01457, 8.4296584],
          [49.0149277, 8.4294273],
          [49.0149104, 8.4293611],
          [49.0149021, 8.4293288],
          [49.0147582, 8.4287731]
      ], {
          fill: false, color: "blue",
          clickable: true,
          weight: 2});
      map.addLayer(hauptfriedhofPolygon);

      // Geocoder
      var northWest = L.latLng(49.0789189956 , 8.2562255859),
          southEast = L.latLng(48.9577317827, 8.5689926147),
          bounds = L.latLngBounds(northWest, southEast);

      var osmGeocoder = new L.Control.OSMGeocoder({
          collapsed: true,
          position: 'topleft',
          text: 'Adresse suchen',
          bounds: bounds
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
          "Grenze der Oststadt": oststadtPolygon,
          "Hauptfriedhof (Test)": hauptfriedhofPolygon
      };
      L.control.layers(baseMaps, overlay, {
          position: 'bottomleft'
      }).addTo(map);

      map.on('resize', function () {
          map.invalidateSize();
      });

  });
