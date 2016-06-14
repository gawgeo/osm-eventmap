angular.module('osmTestApp.filters', [])
  .filter('poiFilter', function(){
      return function(poiArray, conditions) {
          //console.log("filter by ", conditions);
          var reduced = [];
          reduced = poiArray.filter(function(POI) {
              console.log(POI.title);
              var res = true;
              if (conditions.condition && !(POI.title.toUpperCase().indexOf(conditions.condition.toUpperCase())  > -1)) {
                  res = false;
              }
              if (conditions.category && POI.category !== conditions.category) {
                  res = false;
              }
              if (conditions.rule && POI[conditions.rule] !== 1) {
                  res = false;
              }
              if (conditions.status && POI.status !== conditions.status) {
                  console.log("conditions.status && POI.status !== conditions.status", conditions.status, POI.status);
                  res = false;
              }
              return res;
          });
          console.log(reduced);
          return reduced;
      }
  });