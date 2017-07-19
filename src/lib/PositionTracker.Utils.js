'use strict';
const log = require('../misc/ConsoleLog'); log;
let L = null;
const pos2geo = require('./positionsToGeoJson');
let mapboxgl = null;
const _feat00 = pos2geo({empty:true});

module.exports = {
  // mapboxgl stuff:
  mbgl: {

    map: null,
    use(posTrack){
      this.posTrack = posTrack;
      this.map = posTrack.map;
      mapboxgl = require('mapbox-gl/src/index.js');
    }
    ,
    initMap(){
      this.map.on('load', ()=>{
        this.map.addSource('trackGeoJson', {
          type: 'geojson'
          ,data: _feat00 //positionsToGeoJson({positions:_pos})
        });
        this.map.addLayer({
          "id": "trackLineLayer",
          "type": "line",
          "source": "trackGeoJson",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color": "#ff0000",
            "line-width": 4
          }
        });
      });
    }
    ,
    setTrackData(trackGeoJson, options){
      const o = options || {}, fitAll = o.fitAll;
      this.map.getSource("trackGeoJson").setData({
        type: "FeatureCollection",
        features: [trackGeoJson]
      });
      fitAll && this.fitTrack(trackGeoJson);
    }
    ,
    clearTrack(){
      this.map.getSource("trackGeoJson").setData({
        type: "FeatureCollection",
        features: [_feat00]
      }); 
    }
    ,
    fitTrack(trackGeoJson, options){
      const o = options || {}, padding = o.padding || 100;
      const bounds = this.getBoundsFromLineString(trackGeoJson); //log({bounds});
      this.map.fitBounds(bounds, { padding });
    }
    ,
    fitPosition(options){
      const o = options || {}, pos = o.position, _justStarted = o._justStarted;
      const center = [ pos.coords.longitude, pos.coords.latitude ];
      _justStarted && this.map.flyTo({ center, zoom:14.5 });
      !_justStarted && this.map.panTo(center);
    }
    ,
    getBoundsFromLineString(geojson){
      // Inspired by: https://www.mapbox.com/mapbox-gl-js/example/zoomto-linestring/
      const coordinates = geojson.geometry.coordinates; // "Feature"
      // var coordinates = geojson.features[0].geometry.coordinates; "FeatureCollection"
      const bounds = coordinates.reduce(function(bounds, coord) {
          return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
      return bounds;
    }

  } // mbgl
  ,
  // Leaflet stuff:
  leaf: {
    map: null,
    use(posTrack){
      this.posTrack = posTrack;
      this.map = posTrack.map;
      L = require('leaflet');
    }
    ,
    initMap(){
      // L = require('leaflet'); 
      const pl = this.posTrack.polyline = this.polyline();
      const fg = this.posTrack.featureGroup = L.featureGroup();
      this.map.addLayer(pl);
      this.map.addLayer(fg);
    }
    ,
    polyline(){ return L.polyline([], {color: 'red'}); }
    ,
    clearTrack(){
      this.posTrack.featureGroup.clearLayers();
      this.posTrack.polyline.remove();
      this.posTrack.polyline = this.polyline();
      this.map.addLayer(this.posTrack.polyline);
    }
    ,
    showTrack(options){
      let o = options || {};
      const trk = o.track;
      trk.positions.forEach(pos=>{
        const cs = pos.coords;
        const latlng = L.latLng(cs.latitude, cs.longitude);
        const accMrk = L.circle(latlng, {radius: cs.accuracy}).addTo(this.posTrack.featureGroup); accMrk;
        this.posTrack.polyline.addLatLng(latlng);
        this.map.fitBounds(this.posTrack.featureGroup.getBounds());
      });
    }
    ,
    addPos2Track(options){
      let o = options || {};
      const pos = o.mutation.payload.position, cs = pos.coords;
      const latlng = L.latLng(cs.latitude, cs.longitude);
      const accMrk = L.circle(latlng, {radius: cs.accuracy}).addTo(this.posTrack.featureGroup); accMrk;
      this.posTrack.polyline.addLatLng(latlng);
      this.map.setView(latlng);
      o._justStarted && this.map.fitBounds( latlng.toBounds(1000) );
    }
  } // leaf

};
