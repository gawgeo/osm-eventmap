angular.module('osmTestApp', [])
  //use strict
  .controller('osmTestAppCtrl', ['$scope',  function ($scope) {
      console.log("OSM-Test App running!");

      // OSM imports and settings
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});

      // create map with center in Karlsruhe
      var map = new L.Map('simpleMap'); // Map in <div> element mit dem Namen 'simpleMap' laden
      map.addLayer(osm); // Layer server hinzufügen
      map.setView(new L.LatLng(49.0148731, 8.4191506), 14); // Position laden

      // add one marker to map
      var marker = L.marker([49.0148731, 8.4191506]);
      map.addLayer(marker);

      // add circle to map
      var circle = L.circle([49.0148731, 8.43000], 500, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5
      });
      map.addLayer(circle);

      // add polygone by click
      var polygon = L.polygon([
          [49.005, 8.41000],
          [49.013, 8.42000]
      ]);
      map.addLayer(polygon);

      //add marker by click
      function onMapClick(event) {
          var newMarker = L.marker(event.latlng);
          map.addLayer(newMarker);
          console.log("New Marker added: ", event.latlng);
      }
      map.on('click', onMapClick);
  }]);

