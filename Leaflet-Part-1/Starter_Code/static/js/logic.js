// Create our initial map object.
// Set the longitude, latitude, and starting zoom level.
var myMap = L.map("map").setView([39.8283, -98.5795], 5);

// Add a tile layer (the background map image) to our map.
// Use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the API query variables.
let baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(baseURL).then(function (data) {
    for (var i = 0; i < data.features.length; i++) {
        console.log(i);
        let lat = data.features[i].geometry.coordinates[1];
        let long = data.features[i].geometry.coordinates[0];
        let mag = data.features[i].properties.mag;
        let location = data.features[i].properties.place;
        let depth = data.features[i].geometry.coordinates[2];

        function depthColor(depth){
            if (depth >= 90) return "red";
            if (depth >= 70 & depth <90 ) return "orangered";
            if (depth >= 50 & depth <70 ) return "darkorange";
            if (depth >= 30 & depth <50 ) return "orange";
            if (depth >= 10 & depth <30 ) return "greenyellow";
            if (depth >= -10 & depth <10 ) return "lime";
        };

        let circle = L.circle([lat,long], {
            fillOpacity: 1,
            color: "black",
            fillColor: depthColor(depth),
            radius: mag*15000
        });
        circle.addTo(myMap);
        circle.bindPopup((`<h1>${mag} Magnitude earthquake, ${location}, Depth: ${depth}<h1>`));
    }


 // Set up the legend.
    var legend = L.control({ position: "bottomright" })
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["-10","10-30","30-50","50-70","70-90","90+"];
        var colors = ["lime","greenyellow","orange","darkorange","orangered","red"];
        var labels = [];

   // Add the minimum and maximum.
    div.innerHTML = '<div class="labels"><div class="min">'+ limits[0] + '</div> \
        <div class="max">'+ limits[limits.length - 1] + '<div></div>'

   limits.forEach(function(limit, index) {
     labels.push('<li style="background-color: ' + colors[index] + '"></li>')
   })

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div
 }

 // Adding the legend to the map
    legend.addTo(myMap);

});
  

  