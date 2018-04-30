// TODO:  Add babel so we can use ES6
var map;

// Wait for the DOM to be ready then add the Map
document.addEventListener("DOMContentLoaded", function(event) {
  init();
});

function init() {
  map = L.map('map', { zoomSnap: 0.1}).setView([37.8, -96], calculateZoom());
  var tileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    minZoom: 4.5,
    maxZoom: 19
  });
  var stateLayer = new L.GeoJSON.AJAX("data/states.geojson");
  tileLayer.addTo(map);
  stateLayer.addTo(map);
}

function calculateZoom() {
  var sw = screen.width;

  return sw >= 1700 ? 4.7 :
         sw >= 1600 ? 4.3 :
                      4.5 ;
}