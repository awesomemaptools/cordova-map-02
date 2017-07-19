<script>
'use strict';
const log = require('../misc/ConsoleLog'); log;
// const round = require('../misc/Round');
const app = require('../lib/app');
const OnOffIcon = require('./OnOffIcon.vue');
// const $ = require('jquery');

module.exports = {
   name: 'postrack-ui'

  ,components: { OnOffIcon }

  ,data(){
    return {
       title: 'Position Tracker'
      ,app
      ,posTrack: app.positionTracker
      ,trackTitle: ""
      ,trackDescr: ""
      // ,jq: $
    };
  }

  ,computed: {
    savedTracks(){
      let r = this.$store.state.geoData ? this.$store.state.geoData.positionTracks : undefined ; 
      return r;
    }
    ,showUI(){
      return this.$store.state.ui.positionTracker.showUI;
    }
    ,nrTracked(){
      return this.posTrack.positions.length;
    }
    ,disableInputs(){
      return this.posTrack.active || !this.nrTracked;
    }
  }

  ,methods: {
    saveTrack(){
      this.posTrack.save({title: this.trackTitle, description: this.trackDescr });
      this.trackTitle = "";
      this.trackDescr = "";
    }
    ,closeUI(){
      this.$store.commit('showPositionTrackerUI', {show:false});
    }
    ,toggleTracking(){
      this.posTrack.toggle();
      // this.posTrack.active && this.closeUI();
    }
    ,showTrack(track){
      this.closeUI();
      this.posTrack.showTrack({track});
    }
  }

  ,mounted(){
    this.posTrack.uiElement = this.$el;
  }

};

</script>

<template>
<div class="postrack-options" id="postrack-ui" v-show="showUI">
  
  <div class="panel panel-default">
    <div class="panel-heading">
      <button @click.prevent="closeUI()" 
        type="button" class="close" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i></button>
      <h4 class="panel-title">{{title}}</h4>
    </div>
    <div class="panel-body">
      <form>
        <button :class="['btn', posTrack.active ? 'btn-primary' : 'btn-default']" @click.prevent="toggleTracking()">
          <on-off-icon :condition="posTrack.active"/> 
          {{posTrack.active ? 'Active' : 'Inactive'}}
        </button><br/>
        <p>Positions tracked: {{nrTracked}}</p>
        <input class="form-control" v-model.trim="trackTitle" type="text" 
          :disabled="disableInputs" placeholder="Track title"></input><br/>
        <input class="form-control" v-model.trim="trackDescr" type="text" 
          :disabled="disableInputs" placeholder="Track description"></input><br/>
        <button class="btn btn-danger" @click.prevent="posTrack.clear()" 
          :disabled="disableInputs">Clear current track</button>
        <button class="btn btn-success" @click.prevent="saveTrack()" 
          :disabled="disableInputs">Save current track</button>
      </form>
      <hr/>
      <ul v-if="typeof savedTracks !== 'undefined' && savedTracks instanceof Array" class="list-group">
        <li v-for="trk in savedTracks" class="list-group-item"><h5>{{trk.title}}</h5>
         <p v-if="trk.description">{{trk.description}}</p>
         <p># positions: {{trk.positions.length}}</p>
         <button class="btn btn-primary" @click="showTrack(trk)">show</button>
         <button class="btn btn-danger" @click="$store.commit('rmPositionTrack',{track:trk})">delete</button>
        </li>
      </ul>
      <!-- <pre>savedTracks={{savedTracks}}</pre> -->
    </div>
    <div class="panel-footer"><button class="btn btn-primary btn-block" @click.prevent="closeUI()">Close</button></div>
  </div>

</div> <!-- postrack-options -->
</template>

<style scoped>
.postrack-options {
  position: absolute;
  top:8vh;
  height: 92vh;
  overflow-y: scroll;
  z-index: 2000;
}
.panel {
  margin: 0;
}
</style>
