
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


    setupMap()

    preLoadGeoJson()


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
    console.log($("input[title='locationFilter']").change(function (event) {

        let new_state = map.hasLayer(layers[this.value])
        if (new_state == false) {
            paintRegion(this.value)
        } else {
            clearRegion(this.value)
        }
    }))

    /**
    * Function to paint the map with denoted by region.
    * Option are "AB", "Atlantic", "BC", ...
    */
    function paintRegion(region) {
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