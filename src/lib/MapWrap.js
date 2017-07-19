'use strict';
const log = require('../misc/ConsoleLog'); log;
const L = require('leaflet'); L;
const mapboxgl = require('mapbox-gl/src/index.js'); mapboxgl;
const check = require('../misc/ObjectCheckProps');
const gup = require('get-params-from-url'); gup;

/*  Class: MapWrap
    A class that wraps around a leaflet or mapboxgl map
    and provides the same interface.
*/
class MapWrap {
  constructor(options){
    check(options);
    const ops = this.options = options || {};
    ops;
    this.map;

  }

} // class end

module.exports = MapWrap;
