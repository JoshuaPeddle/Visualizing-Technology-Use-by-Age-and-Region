
var layers = {
    "CA":null,
    "AB": null,
    "Atlantic": null,
    "BC": null,
    "MB": null,
    "NL": null,
    "NS": null,
    "NB": null,
    "NT": null,
    "NU": null,
    "ON": null,
    "PE": null,
    "Prairie": null,
    "QC": null,
    "SK": null,
    "YT": null,
}

var map = L.map('map');

$(function () {

    // Configure that map and move it over Canada
    setupMap()
    // Pre load the geoJSON from /geodata/ into layers
    preLoadGeoJson()
    // Once ajax has finished loading the JSON, check a box and paint the map.
    // If we do this before the geoJSON has finished loading the map wont paint the layer because it doesn't exist.
    $(document).ajaxStop(function () {
        // Turn on a location filter and this should paint the map
        // Calling .change() triggers  $("input[title='locationFilter']").change() function from below
        $("#shared_ontario_filter").prop("checked", "true").change()
    });


    /**
     * This function does initial setup of the map and moves it to the correct location
     */
    function setupMap() {
        /* Setup code for leafletjs map */

        var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);  // Add some context to it
        map.fitBounds([ // Move it over Canada
            [60, -125],
            [43, -55]]);
    }

    /**
    * This function loads all of the layers during initial startup.
    * This will increase initial load times slightly but will increase fluidity while running
    */
    function preLoadGeoJson() {

        Object.keys(layers).forEach(el => {
            $.getJSON({
                url: `geodata/${el}.json`,
                contentType: 'application/json',
                success: function (data) {
                    layers[el] = L.geoJson(data)
                    console.log(layers[el])
                },
                error: function (xhr, status, error) {
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            })
        })
    }


    /**
    * Function to monitor input related to the map 
    * 
    */
    $("input[title='locationFilter']").change(function (event) {
        // Check if box was ticked or not ticked
        let new_state = $(this).prop("checked")
        if (new_state == true) {
            paintRegion(this.value) // If it was checked, paintRegion
        } else {
            clearRegion(this.value) // Else, clear region
        }
    })


    function getColor(d) {
        return d > 90 ? '#800026' :
               d > 75  ? '#BD0026' :
               d > 60  ? '#E31A1C' :
               d > 45  ? '#FC4E2A' :
               d > 30   ? '#FD8D3C' :
               d > 15   ? '#FEB24C' :
               d > 0   ? '#FED976' :
                          '#FFEDA0';
    }
    function style(percent) {
        
        return {
            fillColor: getColor(percent),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }


    /**
    * Function to paint the map with denoted by region.
    * Option are "AB", "Atlantic", "BC", ...
    */
    function paintRegion(region, percent) {
        layers[region].setStyle(style(percent))
        layers[region].addTo(map)
    }

    /**
    * Function to clear a region of the map denoted by region.
    * Option are "AB", "Atlantic", "BC", ...
    */
    function clearRegion(region) {
        map.removeLayer(layers[region])
    }


});