'use strict';
const log = require('../ConsoleLog'); log;
const store = require('../../lib/store');
const gup = require('get-params-from-url');
const Aksla = require('./Aksla'); 
const Brosundet = require('./Brosundet'); 

const _tracks = {Aksla, Brosundet};
let _positions = [];
let _count = 0;
const _interval = parseInt(gup('mock-interval')) || 2000;
const _start = gup('mock-start');
const _now = new Date().getTime();
const _rnd = f=>{ return Math.round(Math.random()*f); };

class Mock {
  constructor(options){
    // Properties:
    this.options = options || {};
    this.tracks = {};
    this.intervalRef = null;
    this.active = null;
    // Do initial stuff:
    this.initPositions();
    this.options.start === true || _start && this.start();
  }

/** For each track, create position objects for all latlng's in array:
*/
  initPositions(){
    for(let trk in _tracks){
      this.tracks[trk] = [];
      _tracks[trk].forEach((entry,i)=>{
        this.tracks[trk].push({
          coords: { 
            latitude:entry.lat, 
            longitude:entry.lng, 
            accuracy: _rnd(40),
            altitude: _rnd(100),
            altitudeAccuracy: _rnd(60),
            heading: _rnd(360),
            speed: _rnd(20)
          },
          timestamp: new Date(_now+_interval*i).getTime()
        });
      });
    }
  }

  /** Start setting mock positions for at specific interval:
  */
  start(trackName){
    this.stop(); _count = 0;
    const tName = trackName || 'Aksla';
    _positions = this.tracks[tName];
    this.intervalRef = setInterval(()=>{
      const position = this.tracks[tName][_count];
      store.commit('setPosition', {position});
      _count === (_positions.length-1) ? _count = 0 : _count +=1 ;
    }, _interval);
    this.active = tName;
    // this.active = true;
  }

  /** Stop it again: */
  stop(){
    clearInterval(this.intervalRef);
    this.active = false;
  }

  toggle(){
    this.active ? this.stop() : this.start();
  }

  // getActive(){
  //   return this.active;
  // }

} // class end

module.exports = Mock;

// const $ = require('jquery');
// const Maasroute = require('./Maasroute');
// const parsed = $.parseXML(Maasroute);

    /*const children = parsed.firstChild.children;
    for (let k in children){ 
      // log({child:parsed.firstChild.children[k]});
      if(children[k] && typeof children[k].getAttribute === 'function') { 
        let latStr = children[k].getAttribute('lat');
        let lat = parseFloat(latStr);
        let lonStr = children[k].getAttribute('lon');
        let lon = parseFloat(lonStr);
        // log({ lat, lon });
        _positions.push({
          coords: { 
            latitude:lat, 
            longitude:lon, 
            accuracy: Math.round(Math.random()*40) 
          }
        });
      }
    };*/

    // Aksla.forEach((entry,i)=>{
    //   _positions.push({
    //     coords: { 
    //       latitude:entry.lat, 
    //       longitude:entry.lng, 
    //       accuracy: Math.round(Math.random()*40) 
    //     }
    //   });
    // });
    // log({_positions, l:_positions.length});    
