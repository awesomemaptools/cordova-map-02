<script>
'use strict';
const log = require('../misc/ConsoleLog'); log;
const round = require('../misc/Round');
const app = require('../lib/app');
// const OnOffIcon = require('./OnOffIcon.vue');
// const $ = require('jquery');

module.exports = {
   name: 'position-display'

   ,data(){
    return {
      app
    };
   }

  ,computed: {
     position(){ return this.$store.state.position || null; }
    ,positionString(){
      if(!this.position){ return 'No position'; }
      const cs = this.position.coords;
      return 'lat: ' + round(cs.latitude) + ', lon: ' 
        + round(cs.longitude) + ', acc: ' + cs.accuracy;
    }
  }

};

</script>

<template>
  <div> {{ positionString }} </div>
</template>

<style scoped>
  div {
    position: fixed;
    z-index: 1000;
    bottom: 2rem;
    right: 2rem;
    border: 1px solid rgb(100,100,100);
    background: rgba(255,255,255,0.5);
    width: 20rem;
    height: 2rem;
    overflow: hidden;
    padding: 0.2rem 0.6rem;
    border-radius: 3px;
  }
</style>
