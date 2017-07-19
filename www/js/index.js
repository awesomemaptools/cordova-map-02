// 'use strict';

(function(){ //wrapper

var App = function(){
  var self = this;

  // Application Constructor
  this.initialize = function() {
    // document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    var ismobile = navigator && navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    // console.log('ismobile',ismobile);
    !ismobile && setTimeout(this.onDeviceReady.bind(this), 2000);
    // !ismobile && setTimeout(this.onDeviceReady.bind(this), 2000);
  };

  // deviceready Event Handler
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  this.onDeviceReady = function() {
    this.receivedEvent('deviceready');
    this.mapInit();
  };

  // Update DOM on a Received Event
  this.receivedEvent = function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  };

  this.mapInit = function(){
    // var d = document.getElementById('mapid');
    // console.log('mapInit', this.map);
    if(this.map){return;}
    this.map = L.map('mapid').fitWorld(); //.setView([51.505, -0.09], 13);
    this.map.locate({setView: true, maxZoom: 15});

    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a','b','c']
    }).addTo( this.map );

    this.mapMisc();

  };

  this.mapMisc = function(){

/*    function onMapClick(e) {
      navigator.notification && navigator.notification.alert(`You clicked the map at ${e.latlng.lat}, ${e.latlng.lng}`);
      // navigator.notification && navigator.notification.alert("You clicked the map at " + e.latlng);
      console.log(`You clicked the map at ${e.latlng.lat}, ${e.latlng.lng}`);
      // console.log("You clicked the map at ", e.latlng);
    }
    this.map.on('click', onMapClick);

    
    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(self.map)
          .bindPopup("You are within " + radius + " meters from this point").openPopup();

      L.circle(e.latlng, radius).addTo(self.map);
    }
    this.map.on('locationfound', onLocationFound);*/

    // console.log('navigator.geolocation',navigator.geolocation);
    if(navigator.geolocation){
      console.log('if(navigator.geolocation)');

/*      setInterval(function(){
        navigator.geolocation.getCurrentPosition(
          function(geo){
            var cs = geo.coords;
            var csStr = 'lat: ' + cs.latitude + ', lon: ' + cs.longitude + ' acc: ' + cs.accuracy +'.';
            // var csStr = `lat: ${cs.latitude}, lon: ${cs.longitude}, acc: ${cs.accuracy}`;
            document.getElementById('geo_elm').innerHTML = csStr;
            console.log('navigator.geolocation.getCurrentPosition', csStr);
          }
          ,function(error){
            console.log('navigator.geolocation.getCurrentPosition - error', error);
          }
          ,{ timeout: 4000 }
        );
      }, 5000); // setInterval*/

      navigator.geolocation.watchPosition(
        function(geo){
          var cs = geo.coords;
          var csStr = 'lat: ' + cs.latitude + ', lon: ' + cs.longitude + ' acc: ' + cs.accuracy +'.';
          // var csStr = `lat: ${cs.latitude}, lon: ${cs.longitude}, acc: ${cs.accuracy}`;
          document.getElementById('geo_elm').innerHTML = csStr;
          console.log('navigator.geolocation.watchPosition', csStr);
        }
        ,function(error){
          console.log('navigator.geolocation.watchPosition - error', error);
        }
        ,{ maximumAge:5000, timeout:10000 }
      ); // whatchPosition

    } // if navigator.geolocation
    
  }; // mapMisc

};

window.app = new App();

app.initialize();

}()); //wrapper