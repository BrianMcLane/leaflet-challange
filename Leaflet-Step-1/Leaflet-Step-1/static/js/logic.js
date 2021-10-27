// Store API endpoint in queryURL 
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layer: [streetmap]

})
// Perfrom GET request on the query URL 
d3.json(queryURL).then(function(data) {
    console.log(data.features);

// L.geoJSON(data.features).addTo(myMap)

// Creating circle marker at location of earthquake

L.geoJSON(data, {
    pointToLayer: function(feature,latlng) {
      var depth = feature.geometry.coordinates[2] // Finding depth
      var magnitude = feature.properties.mag*5  // Finding magnitude
      switch (true) {
        case depth <= 1:
          color = "green"
          break;
        case depth <= 3:
          color = "yellow"
          break;
        case depth <= 5:
          color = "orange"
          break;
          case depth <= 7:
          color = "red"
          break;
        default:
          color = "blue"
          console.log(depth)
      }

      return L.circleMarker(latlng, {
        radius: magnitude, 
        fillColor: color,
        fillOpacity: 0.5,
        color: color 
        });
    }
  }).addTo(myMap);
})

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var info = L.control({
  position: "bottomright"
});

info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
info.addTo(myMap)