'use strict';
const log = require('../misc/ConsoleLog'); log;
const Vue = require('vue');
const Vuex = require('vuex');
Vue.use(Vuex);

// import { default as $ } from "jquery";
// import GetId from './GetUniqueId';

const store = new Vuex.Store({
   strict: false
  ,state: {
     ui: {
      positionTracker: {
        showUI: false
      }
     }
    ,app: null
    ,position: null
    // ,appState: null
    // ,backend: null
    ,geoData: {
      positionTracks: []
    }
  }
  ,mutations: {
    /** Set App instance. App cannot be required as it hasn't been instantiated yet. */
     setApp(state,app){
      state.app = app;
    }
    ,showPositionTrackerUI(state,o){
      const pt = state.ui.positionTracker;
      o.show==='toggle' ? pt.showUI = !pt.showUI : pt.showUI = Boolean(o.show) ;        
    }
    /** Set the current position. */
    ,setPosition(state,o){
      state.position = o.position;
    }
    ,addPositionTrack(state,o){
      // Add track from array:
      state.geoData.positionTracks.push(o.track);
      // Save state to Storage:
      store.dispatch('saveGeoDataToStorage');
/*      if(!state.app){ throw new Error("store (Vuex): state.app not set."); }
      state.app.storage.saveGeoData({storageType:'localStorage'})
      .then(msg=>{ log('store.addPositionTrack success!'); log({msg}); })
      .catch((a,b)=>{ log('store.addPositionTrack failed!'); log({a,b}); });*/
    }
    ,rmPositionTrack(state,o){
      // Remove track from array:
      const trks = state.geoData.positionTracks; 
      const ix = trks.indexOf(o.track); //log({o,trks,ix});
      ix > -1 && trks.splice(ix,1); //log({trks});
      // Save state to Storage:
      store.dispatch('saveGeoDataToStorage');
    }
    ,setGeoData(state,o){
      const geoData = o.geoData || {};
      geoData.positionTracks = geoData.positionTracks || [];
      state.geoData = geoData;
    }
  }
  ,getters: {

  }
  ,actions: {
    // context,payload // {commit}
    loadGeoData(context,payload){
      if(!context.state.app){ throw new Error("store (Vuex): state.app not set."); }
      context.state.app.storage.loadGeoData({storageType:'localStorage'})
      .then(geoData=>{
        context.commit('setGeoData', {geoData});
      })
      .catch((a,b)=>{ log('store.actions.loadGeoData failed!'); log({a,b}); });
    }
    ,saveGeoDataToStorage(context,payload){
      if(!context.state.app){ throw new Error("store (Vuex): state.app not set."); }
      context.state.app.storage.saveGeoData({storageType:'localStorage'})
      .then(msg=>{ log('store.dispatch("saveGeoDataToStorage") success!'); log({msg}); })
      .catch((a,b)=>{ log('store.dispatch("saveGeoDataToStorage") failed!'); log({a,b}); });
    }
  }
});

// global._store = store;
module.exports = store;
