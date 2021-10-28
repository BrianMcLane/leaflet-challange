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
        case depth > 50:
          color = "#EA2C2C"
          break;
        case depth > 40:
          color = "#EA822C"
          break;
        case depth > 30:
          color = "#EE9C00"
          break;
        case depth > 20:
          color = "#EECC00"
          break;
        case depth > 10:
          color = "#D4EE00"
          console.log(depth)
        default:
          color = "#98EE00"
          console.log(depth)
      }

      return L.circleMarker(latlng, {
        radius: magnitude, 
        fillColor: color,
        fillOpacity: 0.75,
        color: "black", 
        weight: .5
      });
      
    },
    onEachFeature: function(feature, layer) {
      var mag = feature.properties.mag
      var depth = feature.geometry.coordinates[2]
      var loc = feature.properties.place
      layer.bindPopup(
        "Magnitude: "
          + mag
          + "<br>Depth: "
          + depth
          + "<br>Location: "
          + loc
      );
    }
  })
.addTo(myMap);
})

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {    
  var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 20, 30, 40, 50];    
    var colors = [      
      "#98EE00",      
      "#D4EE00",      
      "#EECC00",      
      "#EE9C00",      
      "#EA822C",      
      "#EA2C2C"    
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.    
    for (var i = 0; i < grades.length; i++) {      
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "      
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");    
    }    
    return div;  
  };
  legend.addTo(myMap)

  