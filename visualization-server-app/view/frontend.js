


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
        let responses = [] // Array to store return values
        $.ajax({
            url: '/responses',
            type: 'GET',
            data: data,
            contentType: 'application/json',
            success: function (response) {
                response.forEach(el => {
                    alert(JSON.stringify(el))
                })
                return responses
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
                    alert(JSON.stringify(el))
                })
                return usages
            },
            //We can use the alert box to show if there's an error in the server-side
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    }


});
