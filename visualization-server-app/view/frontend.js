

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
        let sharedFilters= $(".shared_filters")
        //some kind of forEach code for all of these, checking if checked == true? Could work if each is given a value attribute for what they should have.
        let responseFilters= $(".response_specific_filters")
        let usageFilters= $(".usage_specific_filters")
    });
    /**
     * Ajax function to get responses from the server to the frontend
     */
    function getResponses() {
        // Sample call to responses
        let data = {
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
    function getUsages() {
        // Sample call to usages
        let data = {
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
