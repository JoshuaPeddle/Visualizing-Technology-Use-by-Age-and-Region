

$(function () {

    /**
    * Ready function runs when page is loaded and will be used for setting up the page on initial load
    */
    $(document).ready(function () {
        // Test setting the checkbox to know frontend.js is running
        $("#response_selector").prop("checked", "true")
    });

    /**
    * Event to to keep track of user selecting dataset checkboxes
    */
    $(".dataset_selector").change(function (e) {
        e.preventDefault();
        alert(JSON.stringify([this.title, this.checked]))  // Alert to changes in dataset selectors
        if(this.title == "responseSelector" && this.checked == true) { //for testing
            getResponses()
        }
        else if(this.title == "usageSelector" && this.checked == true){
            getUsages()
        }
    });
    //These should definitely not be set up like this. In reality, we need a "search" button and simply check all these on that button changing.
    $("#requestSearch").change(function(e){
        //functionality wise, to handle multiple selections, we pass arrays containing the search terms into usageSearch and responsesSearch. 
        //Later in this, we remove any key with only empty arrays.
        //Note that geos, while shared, depends on the disabling of geographical regions not shared by Usages and Responses so they are not in this input.
        //geos must also now be translated, since we use Value for geojson on them. 
        let [geos,sexes,serviceTypes,ageGroupsUsages,ageGroupsResponses,incomes,questions,responses] = [[],[],[],[],[],[],[],[]] //this assigns all eight variables their own individual empty arrays on a single line.
        let usagesSearch = {
            geo:geos,
            serviceType:serviceTypes, 
            ageGroup:ageGroupsUsages, 
            income:incomes, 
        }

        let responsesSearch = {
            geo:geos, 
            ageGroup:ageGroupsResponses, 
            sex:sexes,
            question:questions,
            response:responses,
        }
        //Set flags to false right before checking them, in case this is a second+ search.
        var response_selected = false
        var usage_selected = false
        $(".dataset_selector").each(function(){
            if(this.title == "responseSelector" && this.checked == true){
            response_selected = true
            }
            else if(this.title == "usageSelector" && this.checked == true){
            usage_selected = true
            }

        })
        let sharedFilters= $(".shared_filters")
        //some kind of each() code for all of these, checking if checked == true? Could work if each is given a value attribute for what they should have.
        sharedFilters.each(function(){
            let value = $(this).val()
            if($(this).checked==true){
                //This is either an age filter or location filter. Check, then send to child functions to translate into a valid search string for mongoDB.
                if($(this).title=='ageFilter' && usage_selected==true) {
                    toPush = handleAgeFilterValueUsage(value)
                    ageGroupsUsages.push(toPush)
                }
                if($(this).title=='ageFilter' && response_selected==true) {
                    toPush = handleAgeFilterValueResponse(value)
                    toPush.forEach(element => ageGroupsResponses.push(element))//toPush may have more than one element, so this should push each of them without issue.
                }
            }
        });
        let responseFilters= $(".response_specific_filters")
        let usageFilters= $(".usage_specific_filters")

        //code should go here to remove empty dictionary entries, unless we have a more elegant solution. 
        //I expect our validation code to throw an error if they remain, but it simplifies things considerably to have them included before this point.
        getResponses(responsesSearch)
        getUsages(usagesSearch)
    });
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
        else if(incomingValue=='25-44'){incomingValue=verification[2,4]}
        else if(incomingValue=='55-64'){incomingValue=verification[6]}
        else if(incomingValue=='65+'){incomingValue=verification[7]}
        return incomingValue
    }
    /**
     * Ajax function to get responses from the server to the frontend
     */
    function getResponses(data) {
        // Sample call to responses
        data = {
            geo: 'Nova Scotia',
            ageGroup: 'Total, 15 years and over',
            sex: 'Female',
            question: 'Helps to be more creative',
            response: 'Rarely',
        }
        console.log("Data for getResponses:", data)
        let responses = [] // Array to store return values
        $.ajax({
            url: '/responses',
            type: 'GET',
            data: data,
            contentType: 'application/json',
            success: function (response) {
                response.forEach(el => {
                    console.log(JSON.stringify(el))
                    responses.push(el)
                })
                console.log("Responses returning, contents:", console.log(responses))
                return responses //This doesn't appear to work.
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
        console.log("Responses:", responses)
    }

    /**
     * Ajax function to get usages from the server to the frontend
     */
    function getUsages(data) {
        // Sample call to usages
        data = {
            geo: 'Canada', 
            serviceType: 'Have access to the Internet at home', 
            ageGroup: 'Total, Internet users aged 15 years and over', 
            income: 'Total, household income quartiles', 
        }
        let usages = [] // Array to store return values
        $.ajax({
            url: '/usages',
            type: 'GET',
            data: data,
            contentType: 'application/json',
            success: function (response) {
                response.forEach(el => {
                    console.log(JSON.stringify(el))
                    usages.push(el)
                })
                return usages
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
        console.log("Usages:", usages)
    }
    function requestExportUsages() {
        //Note: Do not call directly. Should only be called via the requestExport button.
        $.ajax({
            url: '/usages/tsv',
            type: 'POST',
            data: data, //TODO add search terms here. May be accessible from a global context, or may need a parameter.
            contentType: 'application/json',
            success: function (response) {
                //Does anything go here? Just making the post should complete it.
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }
    function requestExportResponses() {
        //Note: Do not call directly. Should only be called via the requestExport button.
        $.ajax({
            url: '/responses/tsv',
            type: 'POST',
            data: data, //TODO add search terms here. May be accessible from a global context, or may need a parameter.
            contentType: 'application/json',
            success: function (response) {
                //Does anything go here? Just making the post should complete it.
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }

});
