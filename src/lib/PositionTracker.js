'use strict';
const log = require('../misc/ConsoleLog'); log;
// let L = null;
// const L = require('leaflet'); 
const check = require('../misc/ObjectCheckProps');
const gup = require('get-params-from-url');
// const $ = require('jquery');
const positionsToGeoJson = require('./positionsToGeoJson');
const ptutils = require('./PositionTracker.Utils');
const mbgl = ptutils.mbgl; //log({mbgl});
const leaf = ptutils.leaf;

let _count = 1;
let _justStarted;

class PositionTracker {
  constructor(options){
    check(options);
    // Properties:
    this.options = options || {};
    this.app = this.options.app;
    this.leaf = this.app.isLeaflet;
    this.mbgl = this.app.isMapboxGl;
    this.positions = [];
    this.active = false;
    this.trackGeoJson = null;
    // Do stuff:
    options.map && this.addMap(options.map);
    gup('postrack-start') && this.start();
  }

  addMap(map){
    if(!map){ throw new Error('PositionTracker.addMap: no map'); }
    this.map = map;
    // If Leaflet:
    if(this.leaf){
      leaf.use(this);
      leaf.initMap();
    }
    // If mapboxgl:
    if(this.mbgl){
      mbgl.use(this);
      mbgl.initMap();
    }
    this.subscribe();
  }

  start(){
    _justStarted = true;
    this.clear();
    this.active = true;
  }

  stop(){
    this.active = false;
  }

  toggle(){
    this.active ? this.stop() : this.start();
  }

  save(options){
    let o = options || {};
    let title = o.title || 'Position Track #' + _count;
    let description = o.description || ""; _count+=1;
    this.app.store.commit('addPositionTrack', {
      track: {
         title
        ,description
        ,positions: this.positions.slice()
      }
    });
    this.clear();
  }

  clear(){
    this.positions = [];
    this.leaf && leaf.clearTrack();
    this.mbgl && mbgl.clearTrack();
  }

  showTrack(options){
    this.clear();
    this.leaf && leaf.showTrack(options);
    // const positions = options.track.positions;
    const trackGeoJson = positionsToGeoJson({positions: options.track.positions});
    // log({positions, trackGeoJson, mbgl:this.mbgl});
    this.mbgl && mbgl.setTrackData(trackGeoJson, {fitAll:true});
  }

  subscribe(){
    this.app.store.subscribe((mutation, state) => {
      if(!this.active){ return; }
      if(mutation.type !== 'setPosition'){ return; }
      if(!mutation.payload && !mutation.payload.position)
        { throw new Error('PositionTracker.subscribe: no payload / position'); }

      const pos = mutation.payload.position; //, cs = pos.coords;
      this.positions.push(pos);
      this.trackGeoJson = positionsToGeoJson({positions: this.positions}); //log({trackGeoJson:this.trackGeoJson});

      this.leaf && leaf.addPos2Track({mutation, _justStarted});
      this.mbgl && mbgl.setTrackData(this.trackGeoJson);
      this.mbgl && mbgl.fitPosition({position:pos, _justStarted});
      _justStarted = false;
    }); 
  } // subscribe

}

module.exports = PositionTracker;
