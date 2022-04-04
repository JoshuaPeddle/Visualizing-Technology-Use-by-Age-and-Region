

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


});
