
var usage_selected
var response_selected

let current_responses = null
let current_usages = null;

$(function () {

    /**
    * Ready function runs when page is loaded and will be used for setting up the page on initial load
    */
    $(document).ready(function () {
        // Test setting the checkbox to know frontend.js is running
        $("#response_selector").prop("checked", "true").change()
        $("#usage_selector").change()
        $("#requestExport").hide(600)
        
    });
    $(".dataset_selector").change(function(){
            if(this.id == "response_selector" && this.checked == true){
            response_selected=true
            $("#response_specific_filters").show(600)
            //show these filters again if they were hidden.
            $("#shared_newfoundland_filter").show(600)
            $('label[for="shared_newfoundland_filter"]').show(600) //This, amazingly, actually works. Praise to Stack Overflow for documenting better than the docs do.
            $("#shared_pei_filter").show(600)
            $('label[for="shared_pei_filter"]').show(600)
            $("#shared_novascotia_filter").show(600)
            $('label[for="shared_novascotia_filter"]').show(600)
            $("#shared_newbrunswick_filter").show(600)
            $('label[for="shared_newbrunswick_filter"]').show(600)
            $("#shared_manitoba_filter").show(600)
            $('label[for="shared_manitoba_filter"]').show(600)
            $("#shared_saskatchewan_filter").show(600)
            $('label[for="shared_saskatchewan_filter"]').show(600)
            $("#shared_alberta_filter").show(600)
            $('label[for="shared_alberta_filter"]').show(600)
            }
            else if(this.id == "response_selector" && this.checked == false){
            $("#requestExport").hide(600)
            response_selected=false
            clearAllHighlights()
            $("#response_specific_filters").hide(1000)
            //if not  'Canada', 'Atlantic provinces', 'Quebec', 'Ontario', 'Prairie provinces', 'British Columbia', hide! This will look better to the user. Also, deselect any checked boxes.
            $("#shared_newfoundland_filter").hide(1000)
            $('label[for="shared_newfoundland_filter"]').hide(1000) //This, amazingly, actually works. Praise to Stack Overflow for documenting better than the docs do.
            $("#shared_pei_filter").hide(1000)
            $('label[for="shared_pei_filter"]').hide(1000)
            $("#shared_novascotia_filter").hide(1000)
            $('label[for="shared_novascotia_filter"]').hide(1000)
            $("#shared_newbrunswick_filter").hide(1000)
            $('label[for="shared_newbrunswick_filter"]').hide(1000)
            $("#shared_manitoba_filter").hide(1000)
            $('label[for="shared_manitoba_filter"]').hide(1000)
            $("#shared_saskatchewan_filter").hide(1000)
            $('label[for="shared_saskatchewan_filter"]').hide(1000)
            $("#shared_alberta_filter").hide(1000)
            $('label[for="shared_alberta_filter"]').hide(1000)
            $(".shared_filters").each(function(){
                if(this.title == "locationFilter") {
                    this.checked = false; //Bug: This doesn't remove already-painted map regions. However, trying to add this.trigger('change') also ruins unticking the box. 
                }
            })
            }
            else if(this.id == "usage_selector" && this.checked == true){
            usage_selected=true
            $("#usage_specific_filters").show(600)
            }
            else if(this.id == "usage_selector" && this.checked == false){
            usage_selected=false
            $("#requestExport").hide(600)
            clearAllHighlights()
            $("#usage_specific_filters").hide(1000)
            
            }
        })

    $("#requestSearch").click(function(e){
        //functionality wise, to handle multiple selections, we pass arrays containing the search terms into usageSearch and responsesSearch. 
        //Later in this, we remove any key with only empty arrays.
        //If there are multiple selections, do we need to slice out additional searches? Will we need multiple calls to the gets?
        //Note that geos, while shared, depends on the disabling of geographical regions not shared by Usages and Responses so they are not in this input.
        //geos must also now be translated, since we use Value for geojson on them. 
        let [geos,sexes,serviceTypes,ageGroupsUsages,ageGroupsResponses,incomes,questions,responses] = [[],"","",[],[],"","",""] //this assigns all eight variables their own individual empty arrays on a single line.
        if (!response_selected && !usage_selected){
            alert("Select a dataset first")
            return} // If no dataset is selected don't search
        let sharedFilters= $(".shared_filters")
        //Prepare Ages and Locations for the backend processing.
        sharedFilters.each(function(){
            let value = $(this).val()
            // Selectors
            if($(this).prop("selected")==true){
                //This is either an age filter or location filter. Check, then send to child functions to translate into a valid search string for mongoDB.
                // Usage ages
                if($(this).prop("title") =='ageFilter' && usage_selected==true) {
                    toPush = handleAgeFilterValueUsage(value)
                    ageGroupsUsages.push(toPush)
                }
                // Response ages
                if($(this).prop("title")=='ageFilter' && response_selected==true) {
                    toPush = handleAgeFilterValueResponse(value)
                    // Need to check if toPush is an array before doing .forEach
                    if (Array.isArray(toPush)){
                        // If toPush is an array, do forEach and add to ageGroupResponses 
                        toPush.forEach(element => ageGroupsResponses.push(element))//toPush may have more than one element, so this should push each of them without issue.
                    }else{
                        // If its not an array, just add to ageGroupResponses 
                        ageGroupsResponses.push(toPush)
                    }
                }
    
            }
            // Options
            if($(this).prop("checked")==true){
                 // General location 
                if($(this).prop("title")=='locationFilter') {
                    toPush = handleGeo(value)
                    // Need to check if toPush is an array before doing .forEach
                    geos.push(toPush)
                }
        }
        });
        let responseFilters= $(".response_specific_filters")

        responseFilters.each(function a(){
            let value = $(this).val()
            // Selectors
            if($(this).prop("selected")==true){
                //This is either an age filter or location filter. Check, then send to child functions to translate into a valid search string for mongoDB.
     
                // sex filter
                if($(this).prop("title")=='sexFilter') {   
                    sexes =value
                }
                 // question filter
                 if($(this).prop("title")=='questionFilter') {
                    questions = value
                }
                 // response filter
                 if($(this).prop("title")=='responseSubfilter') {
                    responses = value
                }
            }
        });

    
        let usageFilters= $(".usage_specific_filters")
        usageFilters.each(function(){
            let value = $(this).val()
            // Selectors
            if($(this).prop("selected")==true){
                //This is either an age filter or location filter. Check, then send to child functions to translate into a valid search string for mongoDB.
     
                // sex filter
                if($(this).prop("title")=='serviceType') {
                    serviceTypes = value
                         
                }
            }
        });

        let usagesSearch = {
            geo:geos,
            serviceType:serviceTypes, 
            ageGroup:ageGroupsUsages, 
            //income:incomes, Had to remove for now. Was crashing server //We don't support searching by income anyways, so not a problem.
        }

        let responsesSearch = {
            geo:geos, 
            ageGroup:ageGroupsResponses, 
            sex:sexes,
            question:questions,
            response:responses,
        }
        console.log(responsesSearch)
        console.log(usagesSearch)
        if (geos.length == 0){
            alert("Select a location first")
            return}// If no locations are selected. Don't search.
        if (response_selected){
            // We have to wait for the request to complete before using the responses
            $.when(getResponses(responsesSearch)).done(()=>{
                // We have the responses in here set to global variable current_responses
                drawResponses(current_responses)

                
            })
        }
           
        if (usage_selected){
            // We have to wait for the request to complete before using the usages
            $.when(getUsages(usagesSearch)).done(()=>{
                //We have the usages here set to global variable current_usage
                // drawResponses
                drawUsages(current_usages)
            })
        }
        
        $("#requestExport").show(600)
    });


    /**
     * Code for export button
     */
    $("#requestExport").click(function(){

        if (response_selected){requestExportResponses()}
        if (usage_selected){requestExportUsages()}
    })


    function handleAgeFilterValueUsage(incomingValue){
        //If for some reason the back-end verification strings changed, this array would just need to be replaced. If length changed, more work would be required.
        let verification = ['Total, Internet users aged 15 years and over', 'Internet users aged 15 to 24 years', 'Internet users aged 25 to 44 years', 'Internet users aged 45 to 64 years', 'Internet users aged 65 years and over']
        if(incomingValue=='15+'){incomingValue=verification[0]}
        else if(incomingValue=='15-24'){incomingValue=verification[1]}
        else if(incomingValue=='25-44'){incomingValue=verification[2]}
        else if(incomingValue=='45-64'){incomingValue=verification[3]}
        else if(incomingValue=='65+'){incomingValue=verification[4]}
        return incomingValue
    }
    //Age brackets to join on age: 15+, 15-24, 25-44, 45-64, 65+ This is more useful for visualization than representing the full breadth of Response. Direct comparison of Usage and Response is half the vision.
    function handleAgeFilterValueResponse(incomingValue){
        //If for some reason the back-end verification strings changed, this array would just need to be replaced. If length changed, more work would be required.
        let verification = ['Total, 15 years and over', '15 to 24 years','25 to 34 years', '25 to 54 years', '35 to 44 years', '45 to 54 years', '55 to 64 years', '65 years and over', '65 to 74 years', '75 years and over' ]
        if(incomingValue=='15+'){incomingValue=verification[0]}
        else if(incomingValue=='15-24'){incomingValue=verification[1]}
        else if(incomingValue=='25-44'){incomingValue=[verification[2],verification[4]]}
        else if(incomingValue=='45-64'){incomingValue=verification[6]}
        else if(incomingValue=='65+'){incomingValue=verification[7]}
        return incomingValue
    }

    //Age brackets to join on age: 15+, 15-24, 25-44, 45-64, 65+ This is more useful for visualization than representing the full breadth of Response. Direct comparison of Usage and Response is half the vision.
    function handleGeo(incomingValue){
        //If for some reason the back-end verification strings changed, this array would just need to be replaced. If length changed, more work would be required.
        let verification = ['Canada', 'Atlantic provinces', 'Newfoundland and Labrador', 'Prince Edward Island', 'Nova Scotia', 'New Brunswick', 'Quebec', 'Ontario', 'Prairie provinces', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia']
        if(incomingValue=='CA'){incomingValue=verification[0]}
        else if(incomingValue=='Atlantic'){incomingValue=verification[1]}
        else if(incomingValue=='NL'){incomingValue=verification[2]}
        else if(incomingValue=='PE'){incomingValue=verification[3]}
        else if(incomingValue=='NS'){incomingValue=verification[4]}
        else if(incomingValue=='NB'){incomingValue=verification[5]}
        else if(incomingValue=='QC'){incomingValue=verification[6]}
        else if(incomingValue=='ON'){incomingValue=verification[7]}
        else if(incomingValue=='Prairie'){incomingValue=verification[8]}
        else if(incomingValue=='MB'){incomingValue=verification[9]}
        else if(incomingValue=='SK'){incomingValue=verification[10]}
        else if(incomingValue=='AB'){incomingValue=verification[11]}
        else if(incomingValue=='BC'){incomingValue=verification[12]}
        return incomingValue
    }
    /**
     * Ajax function to get responses from the server to the frontend
     */
    function getResponses(data) {

        return $.ajax({
            url: '/responses',
            type: 'GET',
            data: data,
            dataType: "json",
            success: function (response) {
                if (response == "no responses"){return response}
                current_responses = response
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
        
        
    }

    /**
     * Ajax function to get usages from the server to the frontend
     */
    function getUsages(data) {

        return $.ajax({
            url: '/usages',
            type: 'GET',
            data: data,
            dataType: "json",
            success: function (response) {
                if (response == "no usages"){return response}
                current_usages = response
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }
    function requestExportUsages() {
        console.log("got", current_responses)
        //Note: Do not call directly. Should only be called via the requestExport button.
        $.ajax({
            url: '/usages/tsv',
            type: 'POST',
            data: {body: JSON.stringify(current_usages)},
            success: function (response) {
                //https://javascript.info/blob //https://stackoverflow.com/questions/63199136/sending-csv-back-with-express
                const url = window.URL.createObjectURL(new Blob([response],{type:"text/plain"}))
                const a = document.createElement("a")
                a.style.display = 'none'
                a.href = url;
                a.download = "usage_export.tsv"
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }
    function requestExportResponses() {
        console.log("got", current_responses)
        //Note: Do not call directly. Should only be called via the requestExport button.
        $.ajax({
            url: '/responses/tsv',
            type: 'POST',
            data :{body: JSON.stringify(current_responses)},
            success: function (response) {
                //https://javascript.info/blob //https://stackoverflow.com/questions/63199136/sending-csv-back-with-express
                const url = window.URL.createObjectURL(new Blob([response],{type:"text/plain"}))
                const a = document.createElement("a")
                a.style.display = 'none'
                a.href = url;
                a.download = "response_export.tsv"
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)

            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }

});
