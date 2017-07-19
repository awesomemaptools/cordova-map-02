'use strict';
const log = require('../misc/ConsoleLog');
const check = require('../misc/ObjectCheckProps');
const gup = require('get-params-from-url');
let L = null;
// const mapboxgl = require('mapbox-gl'); log({mapboxgl});
let mapboxgl = null; 
const PositionTracker = require('./PositionTracker'); //log({PositionTracker});
const Mock = require('../misc/MockPosition'); 
const Storage = require('./Storage');
const $ = require('jquery');
// const noop = undefined;

class App {
  constructor(options){
    check(options);
    const ops = this.options = options || {};
    // Properties:
    this.mapLibrary = ops.mapLibrary || 'leaflet'; // 'mapbox-gl'
    this.isLeaflet = this.mapLibrary === 'leaflet';
    this.isMapboxGl = this.mapLibrary === 'mapbox-gl';
    this.store = ops.store; // Vuex Store instance 
    // this.positionTracker;
    this.positionTracker = new PositionTracker({app:this});
    // this.isLeaflet ? this.positionTracker = new PositionTracker({app:this}) :noop;
    this.mockPosition = new Mock();
    this.storage = new Storage({app:this});
    this.map;
    this.vueRootInst;
    this.ismobile;

    // Do stuff:
    if(this.isLeaflet){
      L = require('leaflet');
      L.Icon.Default.imagePath = '/vendor/leaflet/dist/images/';
    }
    if(this.isMapboxGl){
      mapboxgl = require('mapbox-gl/src/index.js');
    }
    this.initialize();
  }

  initialize() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    $(document).ready(a=>{ log('$(document).ready()'); });
    this.ismobile = navigator && navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    log({'app.ismobile': this.ismobile});
    // In case you run this in a regular browser:
    !this.ismobile && $(document).ready(()=>{
      log('not mobile, i.e. no "deviceready" event.');
      this.onDeviceReady();
    });
  }

  // Orignal Cordova comment here = deviceready Event Handler. Bind any cordova events here. Common events are: 'pause', 'resume', etc.
  onDeviceReady() {
    this.receivedEvent('deviceready');
    // this.vueInit();
    this.subscribeGeolocation();
    this.mapInit();
    this.testSqlPlugin();
  }

  // Update DOM on a Received Event
  receivedEvent(id) {
    log('Received Event: ' + id);
  }

  mapInit(){
    if(this.map){ return; }
    this.isLeaflet && this.initLeafletMap();
    this.isMapboxGl && this.initMapboxGlMap();
    // this.positionTracker = new PositionTracker({app:this});
    this.positionTracker.addMap(this.map);
    // this.isLeaflet && this.positionTracker.addMap(this.map);
    this.isLeaflet && this.mapMisc();
  }

  initLeafletMap(){
    log('initLeafletMap');
    this.map = L.map('map-container').fitWorld();
    this.map.locate({setView: true, maxZoom: 15});
    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a','b','c']
    }).addTo( this.map );
    // L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWxsdnRyemVnIiwiYSI6ImNpejl4M2M0NDAxbWoycXRlanZnc283dnYifQ.sPFCSTsdlCOp1hk6afDvJg')
    // .addTo( this.map );
  }

  initMapboxGlMap(){
    log('initMapboxGlMap');
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWxsdnRyemVnIiwiYSI6ImNpejl4M2M0NDAxbWoycXRlanZnc283dnYifQ.sPFCSTsdlCOp1hk6afDvJg';
    this.map = new mapboxgl.Map({
        container: 'map-container', // container id
        // style: '/styles/osm-bright.json',
        // style: 'mapbox://styles/ellvtrzeg/cizzkhyut00aw2smrbbul575u', 
        style: 'mapbox://styles/mapbox/streets-v9', 
        // style: 'mapbox://styles/mapbox/outdoors-v10', //stylesheet location
        center: [6.16342, 62.47126], // aalesund 
        // center: [6.51009, 62.21062], // hjorungfjord
        zoom: 11 // starting zoom
    });
    // log({'mapboxgl.Map':this.map});
    // !this.ismobile && this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  mapMisc(){
    // Display clicked position in console:
    this.map.on('click', e=>{ log({ latlng:e.latlng }); });
    // Collect clicked position in array (ie use to create a route):
    if(gup('track-mapclicks')){
      global.mapClicks = [];
      this.map.on('click', e=>{ global.mapClicks.push(e.latlng); });
    }
  } // mapMisc

  subscribeGeolocation(){
    const self = this;
    if(navigator.geolocation){
      // log('if(navigator.geolocation)');
      navigator.geolocation.watchPosition(
        function(position){
          self.store.commit('setPosition', {position});
          log({msg:'navigator.geolocation.watchPosition', position});
        }
        ,function(error){
          log({msg:'navigator.geolocation.watchPosition - error', error});
        }
        ,{ maximumAge:5000, timeout:10000, enableHighAccuracy:true }
      ); // whatchPosition
    } // if navigator.geolocation
  }

  testSqlPlugin(){
    // https://github.com/litehelpers/Cordova-sqlite-storage
    // window.sqlitePlugin.echoTest(successCallback, errorCallback);
    try {
      window.sqlitePlugin.echoTest(
        (a,b,c)=>{ log('window.sqlitePlugin.echoTest successCallback'); }
        , 
        (a,b,c)=>{ log('window.sqlitePlugin.echoTest errorCallback'); }
      );
    } catch(e){ log(e); }
  }

// For strange reasons, this doesn't work - not even when run from main.js:
/*  vueInit(){
    this.vueRootInst = new Vue({
       el: '#map_app'
      ,render: (h) => h(MapApp)
    });
  }*/

} // class end

module.exports = App;
