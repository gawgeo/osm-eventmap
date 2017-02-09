angular.module('osmTestApp.filters', [])
  .filter('poiFilter', function(){
      return function(poiArray, conditions) {
          //console.log("filter ", poiArray, " by ", conditions);
          var reduced = [];
          reduced = poiArray.filter(function(POI) {
              var res = true;
              if (conditions.condition && !(POI.title.toUpperCase().indexOf(conditions.condition.toUpperCase())  > -1)) {
                  res = false;
              }
              if (conditions.categories.length > 0 && conditions.categories.indexOf(POI["category"]) === -1) {
                  res = false;
              }
              /*
              if (conditions.category && POI.category !== conditions.category) {
                  res = false;
              }*/
              if (conditions.rule && POI[conditions.rule] !== 1) {
                  res = false;
              }
              if (conditions.status && POI.status !== conditions.status) {
                  res = false;
              }
              return res;
          });
          return reduced;
      }
  });