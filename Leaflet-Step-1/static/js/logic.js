// Store our API endpoint inside queryUrl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>Time: " + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude : " + feature.properties.mag + ",/p");
    }
    
    function radiusSize(magnitude) {
      return magnitude * 20000;
    }
    
    function circleColor(magnitude) {
      if (magnitude < 1) {
        return "#ccff33"
      }
      else if (magnitude < 2) {
        return "#ffff33"
      }
      else if (magnitude < 3) {
        return "#ffcc33"
      }
      else if (magnitude < 4) {
        return "#ff9933"
      }
      else if (magnitude < 5) {
        return "#ff6633"
      }
      else {
        return "#ff3333"
      }
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

 var greyscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

 // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
    37.09, -105.71
    ],
    zoom: 5,
    layers: [greyscale, earthquakes]
  });


  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = ['#ccff33', '#ffff33', '#ffcc33', '#ff9933', '#ff6633', '#ff3333']

    var labels = [];
   
   var legendInfo = '<strong>Magnitude</strong>';

   div.innerHTML = legendInfo;

    grades.forEach(function(grade, index) {
      console.log(grades[index]);
        labels.push('<br>' + '<div style="background-color:' + colors[index] + 
          "; width: 10px; height: 15px; display: inline-block\"></div>" + 
          " " + grades[index] + (grades[index + 1] ? ' - ' + grades[index + 1]: '+'));
    });

    div.innerHTML += labels.join("");
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);


}
