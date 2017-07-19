'use strict';
// Dummy feature for clearing map with "empty" data:
const _feat00 = { 
  type:"Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [ [0,0] ]
  }
};

module.exports = options => {
  const o = options || {};
  const positions = o.positions || [];
  if(o.empty) return _feat00;
  
  let geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: []
    }
  };
  positions.forEach(pos=>{
    geojson.geometry.coordinates.push([ pos.coords.longitude, pos.coords.latitude ]);
  });
  return geojson;
};
