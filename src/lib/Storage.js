'use strict';
// const log = require('../misc/ConsoleLog'); log;

class Storage {
  /**
  @param {App} app - required.  
  */
  constructor(options){
    this.options = options || {};
    this.app = options.app;
    this.store = options.app.store;

    if(!global.localStorage){
      throw new Error("Storage: 'localStorage' not supported by client.");
    }
  }

  /**
  @param {string} options - required; object with options.
  @param {string} options.storageType - required. 'localStorage' supported.
  @returns {Promise}
  */
  saveGeoData(options){
    const op = options || {};
    if(op.storageType !== 'localStorage'){
      throw new Error("Storage.saveGeoData: storageType 'localStorage' supported. You used: "+op.storageType);
    }
    const prom = new Promise((resolve, reject)=>{
      try {
        const geoDataStr = JSON.stringify(this.store.state.geoData);
        global.localStorage.setItem('geoData', geoDataStr);
        // setTimeout(()=>{ resolve('Success!'); }, 2000);
        resolve('Success!');
      } catch(err){
        reject('Storage.saveGeoData failed', err);
      }
    });
    return prom;
  } 

  /**
  @param {string} options - required; object with options.
  @param {string} options.storageType - required. 'localStorage' supported.
  @returns {Promise}
  */
  loadGeoData(options){
    const op = options || {};
    if(op.storageType !== 'localStorage'){
      throw new Error("Storage.loadGeoData: storageType 'localStorage' supported. You used: "+op.storageType);
    }
    const prom = new Promise((resolve, reject)=>{
      try {
        const geoDataStr = global.localStorage.getItem('geoData');
        const geoData = JSON.parse(geoDataStr);
        resolve(geoData);
      } catch(err){
        reject('Storage.loadGeoData failed', err);
      }
    });
    return prom;
  }
}

module.exports = Storage;
