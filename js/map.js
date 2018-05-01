$( document ).ready(()=> {
 
var map = L.map('map', { zoomSnap: 0.1, zoomControl: false});
setDefaultZoom();
// Add zoom to top right
L.control.zoom({position:'topright'}).addTo(map);

var tileLayer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  minZoom: 4.5,
  maxZoom: 19
});
var districtLayer = new L.GeoJSON.AJAX("data/districts.geojson");
var stateLayer = new L.GeoJSON.AJAX("data/states.geojson");
tileLayer.addTo(map);
stateLayer.addTo(map);


// Zoom in/out when clicking on a state
stateLayer.on('click', function(e) {
  map.fitBounds(e.layer.getBounds());
});
districtLayer.on('click', function(e) {
  setDefaultZoom();
});

// Hide district layer unless we're zoomed in
map.on('zoomend', function() {
  if (map.getZoom() < (calculateZoom() + 1)){
    if (map.hasLayer(districtLayer)) {
        map.removeLayer(districtLayer);
    }
  } else {
    if (!map.hasLayer(districtLayer)){
      map.addLayer(districtLayer);
    }
  }
});

// Helper functions
function calculateZoom() {
  var sw = screen.width;

  return sw >= 1700 ? 4.7 :
         sw >= 1600 ? 4.3 :
                      4.5 ;
}

function setDefaultZoom() {
  map.setView([37.8, -96], calculateZoom());
}

});