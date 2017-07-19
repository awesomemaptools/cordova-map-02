'use strict';
const log = require('./misc/ConsoleLog'); global._log = log;
require('./css/basic.css');
// log(require('./css/basic.css'));
const $ = require('jquery'); 
global.$ = $; global.jQuery = $;
require('bootstrap');
const Vue = require('vue');
const MapAppUI = require('./vue/MapAppUI.vue');

const app = require('./lib/app');
global._app = app; //log({app});;

Vue.config.errorHandler = function (err, vm) {
  console.log('Vue errorHandler',err,vm);
};
  
app.vueRootInst = new Vue({
  el: '#map_app_ui'
  ,render: (h) => h(MapAppUI)
});
// app.vueInit();
