$(function () {

    /* Setup code for leafletjs map */
    var map = L.map('map');  // Create a map object
    var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1 
    }).addTo(map);  // Add some context to it
    map.fitBounds([ // Move it over Canada
        [60, -125],
        [43, -55]]);
});