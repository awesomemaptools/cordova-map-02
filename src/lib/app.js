'use strict';
/**
  Singleton instance of App.
*/
const log = require('../misc/ConsoleLog');
const App = require('./App'); //log({App});
const store = require('./store');
const gup = require('get-params-from-url');

// Use url param to switch map library:
const mapjs = gup('mapjs'); log({mapjs:mapjs});
let mapLibrary = 'mapbox-gl'; // default;
// let mapLibrary = 'leaflet'; // default;
mapjs === 'leaflet' ? mapLibrary = 'leaflet' :0;
// mapjs === 'mbgl' ? mapLibrary = 'mapbox-gl' :0;
const app = new App({store, mapLibrary});
store.commit('setApp', app);
store.dispatch('loadGeoData');

module.exports = app;
