angular.module('osmTestApp', [])
    //use strict
    .controller('osmTestAppCtrl', function () {
        console.log("OSM-Test App running!");
        
            // OSM imports and settings
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 18, attribution: osmAttrib});

        // create map with center in Karlsruhe
        var map = new L.Map('simpleMap');
        map.addLayer(osm); // Layer server hinzufügen
        map.setView(new L.LatLng(49.0148731,8.4191506),14); // Position laden

    });

