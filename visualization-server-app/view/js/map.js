// This global variable loads the processed getJSON data.
// Each object is preloaded at startup and is manipulated though setStyle()
// For example Alberta can be drawn by calling paintRegion("AB") and cleared though clearRegion("AB")
var layers = {
    "CA": null,
    "AB": null,
    "Atlantic": null,
    "BC": null,
    "MB": null,
    "NL": null,
    "NS": null,
    "NB": null,
    "ON": null,
    "PE": null,
    "Prairie": null,
    "QC": null,
    "SK": null,
}

// Configure a global var map. This is the base map object. 
var map = L.map('map', {
    zoomSnap: 0.1, // Resolution of zoom levels. (zoom +- zoomSnap)
    zoomDelta: 0.25, // This is the zoom for the +- buttons
    wheelPxPerZoomLevel: 1000, // Slow down zoom with mouse wheel
    scrollWheelZoom: 'center', // Force zoom to zoom to the center of the map.
    maxZoom: 5,
    minZoom: 3
});

//Popup variable
var overlay;

$(function () {

    // Configure that map and move it over Canada
    setupMap()
    // Pre load the geoJSON from /geodata/ into layers
    preLoadGeoJson()
    // Once ajax has finished loading the JSON, check a box and paint the map.
    // If we do this before the geoJSON has finished loading the map wont paint the layer because it doesn't exist.

    // Create our overlay Object
    overlay = L.control();

    //When added to map.. do
    overlay.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // This method updates the overlay based on the properties of the layer that triggered the event
    overlay.update = function (props) {
        // Added some logic here to be interactive with the user
        if (!response_selected && !usage_selected) {  // If neither dataset is selected
            this._div.innerHTML = '<h4>Select a dataset</h4>';
            return
        }
        if (!current_responses && !current_usages) {  // If no data has been retrieved via search yet
            this._div.innerHTML = '<h4>Complete a search</h4>';
            return
        }
        if (props != undefined && props.value != undefined) { // If this region has been searched and value is populated
            this._div.innerHTML = '<h4>Results from survey</h4>' + (props ?
                '<b>' + props.name + '</b><br />' + props.value + ' % '
                : 'Hover over a region');
        } else {  // Dataset is selected, user has searched for, and retrieved data, but is not hovering anything
            this._div.innerHTML = '<h4>Hover over a region</h4>';
        }
    };

    // Once all ajax are finished, add the overlay to the map. This causes issued is it attempts to draw before geoJSON is loaded by json
    $(document).ajaxStop(function () {
        overlay.addTo(map);

    })

    /**
     * This function does initial setup of the map and moves it to the correct location
     */
    function setupMap() {
        /* Setup code for leafletjs map */

        var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);  // Add some context to it
        map.fitBounds([ // Move it over Canada
            [60, -125],
            [43, -55]]);
        map.setZoom(4.5)
    }

    /**
    * This function loads all of the layers during initial startup.
    * This will increase initial load times slightly but will increase fluidity while running
    */
    function preLoadGeoJson() {

        Object.keys(layers).forEach(el => {
            $.getJSON({                // using jquery getJSON method to read geoJSON
                url: `geodata/${el}.json`,
                contentType: 'application/json',
                success: function (data) {
                    layers[el] = L.geoJson(data, {
                        onEachFeature: onEachFeature // This assigned the functions defined in function onEachFeature() below to the layer
                    })
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
        overlay.update()   // Update the Overlay when location filters are checked. This updates the interactive messages to the user.
        if (new_state == true) {
            paintRegion(this.value) // If it was checked, paintRegion
        } else {
            clearRegion(this.value) // Else, clear region
        }
    })



    //https://leafletjs.com/SlavaUkraini/examples/choropleth/
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    // Called when the users mouse enters the highlighted region
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 4,
            color: '#999',
            dashArray: '',
            fillOpacity: 0.7
        });
        overlay.update(layer.feature.properties);
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    // Called when the users mouse leaves the highlighted region
    function resetHighlight(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        })
        overlay.update();
        layer.options.weight = 1
    }


});

/// Need to parse geo from mongo style to getJSON style
function handleGeoReverse(incomingValue) {
    //If for some reason the back-end verification strings changed, this array would just need to be replaced. If length changed, more work would be required.
    let outgoingValues = ['CA', 'Atlantic', 'NL', 'PE', 'NS', 'NB', 'QC', 'ON', 'Prairie', 'MB', 'SK', 'AB', 'BC']
    let potentialIncomingValues = ['Canada', 'Atlantic provinces', 'Newfoundland and Labrador', 'Prince Edward Island', 'Nova Scotia', 'New Brunswick',
        'Quebec', 'Ontario', 'Prairie provinces', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia']
    return outgoingValues[potentialIncomingValues.indexOf(incomingValue)]
}

// Get a color based on the value. Finer detail than getColorSimple. Implementation returns colors similar to getColorSimple
function getColor(d) {
    let red = parseInt(255 - d * 1)
    let green = parseInt(237 - (d * 2.2))
    let blue = parseInt(160 - d * 1.4)
    return `#${red.toString(16) + green.toString(16) + blue.toString(16)}`
}


// Simple get color function
function getColorSimple(d) {
    return d > 90 ? '#800026' :
           d > 75  ? '#BD0026' :
           d > 60  ? '#E31A1C' :
           d > 45  ? '#FC4E2A' :
           d > 30   ? '#FD8D3C' :
           d > 15   ? '#FEB24C' :
           d > 0   ? '#FED976' :
                      '#FFEDA0';
}

// Returns a style for the drawn region. Color is determined by percent
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

// Add a property to one of the layers
function setLayerProperty(region, propertyName, value) {
    // This foreach handles the Prairie provence and Atlantic provence multi-region case
    Object.keys(layers[region]._layers).forEach(el => {
        layers[region]._layers[el].feature.properties[propertyName] = value
    })

}
// fetch a property from one of the layers
function getLayerProperty(region, propertyName) {
    return layers[region]._layers[Object.keys(layers[region]._layers)[0]].feature.properties[propertyName]
}


// Paint a region a specific color. Percent 0-100.
function paintRegionPercent(region, percent) {
    layers[region].setStyle(style(percent))
    setLayerProperty(region, "value", percent)
    layers[region].addTo(map)
}
/**
* Function to paint the map with denoted by region.
* Option are "AB", "Atlantic", "BC", ...
*/

function paintRegion(region, percent) {
    layers[region].setStyle(style(0)).addTo(map)
}

/**
* Function to clear a region of the map denoted by region.
* Option are "AB", "Atlantic", "BC", ...
*/
function clearRegion(region) {
    map.removeLayer(layers[region])
}

// Pass an array of responses to have them displayed on the map
function drawResponses(responses) {
    responses.forEach(response => {
        // Need to check if the estimate is percentage of persons
        if (response.estimate == "Percentage of persons") {
            paintRegionPercent(handleGeoReverse(response.geo), response.value)
        }
    })
}

// Pass an array of usages to have them displayed on the map
function drawUsages(usages) {
    // No need to check anything. Can just draw
    usages.forEach(usage => {
        if (usage.income == "Total, household income quartiles") {
            paintRegionPercent(handleGeoReverse(usage.geo), usage.value)
        }
    })
}

// Call this to remove all painted regions
function clearAllHighlights() {
    // For each region in layers, try to remove it. We can't fully reset the map because other things are added to it.
    Object.keys(layers).forEach(region => {
        if (region != null || region != undefined) {
            // Layer might not be on map so do try catch
            try {
                map.removeLayer(layers[region])
            } catch (error) {
                // Layer not loaded yet
            }
        }
    })
}