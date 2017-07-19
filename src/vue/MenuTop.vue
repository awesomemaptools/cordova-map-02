<script>
'use strict';
const log = require('../misc/ConsoleLog'); log;
const $ = require('jquery');
const app = require('../lib/app');
const OnOffIcon = require('./OnOffIcon.vue');

module.exports = {
   name: 'menu-top'

  ,components: { OnOffIcon }

  ,data(){
    return {
       title: 'Z'
      ,app: app
      ,mock: app.mockPosition
      ,posTrack: app.positionTracker
    };
  }

  ,computed: {
  }

  ,methods: {
    togglePosTrackUI(){
      this.$store.commit('showPositionTrackerUI', {show:'toggle'});
    }
  }

  ,mounted(){
    // Hide collapsable menu when anything is clicked - may be buggy:
    $(document.body).click(()=>{
      $('#menu-top-collapse').collapse('hide');
    });
    this.mock = app.mockPosition;
    this.posTrack = app.positionTracker;
  }

};

</script>

<template>

<!-- http://getbootstrap.com/components/#navbar-default -->
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu-top-collapse" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="menu-top-collapse">
      <ul class="nav navbar-nav">
        <li v-if="posTrack"><a>
          <span @click.prevent="posTrack.toggle()"><on-off-icon :condition="posTrack.active"/></span>
            <button class="btn btn-default btn-sm" @click="togglePosTrackUI()">Track position</button>
          </a>
        </li>
<!--         <li><a href="#" @click="mockToggle()">
          <on-off-icon :condition="mockActive"/> Mock position</a></li> -->
        <li v-for="(track,name) in mock.tracks">
          <a @click.prevent="mock.active !== name ? mock.start(name) : mock.stop()">
          <on-off-icon :condition="mock.active === name"/> Mock {{name}}</a>
        </li>
      </ul>
    </div> <!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

</template>

<style scoped>
  /*.navbar-brand.position {
    font-size: 1.2rem;
  }*/
  /*.navbar-collapse {*/
  .navbar-nav {
    background: #f8f8f8;
    /*background: #ffffff;*/
  }
  
</style>
