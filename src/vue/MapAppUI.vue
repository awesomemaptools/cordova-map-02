<script>
'use strict';
// const log = require('../misc/ConsoleLog');
const store = require('../lib/store');
const MenuTop = require('./MenuTop.vue');
const PostrackUi = require('./PostrackUi.vue');
// const round = require('../misc/Round');
const PositionDisplay = require('./PositionDisplay.vue');

module.exports = {
   name: 'map-app'

  ,store

  ,components: { MenuTop, PostrackUi, PositionDisplay }

  ,data(){
    return {
      title: 'Map App'
    };
  }

  ,computed: {
    app(){ return this.$store.state.app; }
  }

};

</script>

<template><span>

<div class="zg-top-content">
  <menu-top/>
  <!-- <div id="mapid" class="map-basic"></div> -->
</div>
<postrack-ui v-if="app.positionTracker"/>
<position-display/>

</span></template>

<style scoped>
/*.zg-top-content .position {
  position: fixed;
  padding: 60px 1rem 1rem 1rem;
}*/
.navbar, .zg-top-content {
  height: 8vh;
}
</style>
