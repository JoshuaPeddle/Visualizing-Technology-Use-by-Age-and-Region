const Response = require('../model/response').Response;
const fs = require('fs');
let validator = require('validator');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getResponses = async (req,res) =>{
    //need to get search dict from req
    console.log("req.query below")
    console.log(req.query)
    //this.validateSearchTerms(req.query) // not hooked up properly
    // TODO: Validate req.query
    let objs = await Response.getResponses(req.query);
    // This is just a simple check to see if anything was returned
    if (objs.length >=1){
        // If we have requests, send them to client
        res.send(objs)
    }else{
        // Let the client know no requests were found
        res.send("no responses")
    }
}

async function validateSearchTerms(searchTerms)  {
searchTerms = searchTerms.toArray()
console.log("Array of searchTerms: ")
console.log(searchTerms)
validGeo = ['Canada', 'Atlantic provinces', 'Newfoundland and Labrador', 'Prince Edward Island', 'Nova Scotia', 'New Brunswick', 'Quebec', 'Ontario', 'Prairie provinces', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia'] //all the sets to input, will do later.
validAgeGroup = ['Total, 15 years and over', '15 to 24 years','25 to 34 years', '25 to 54 years', '35 to 44 years', '45 to 54 years', '55 to 64 years', '65 years and over', '65 to 74 years', '75 years and over' ] 
validSex = ['Male', 'Female', 'Both sexes']
validQuestion = ['Helps make more informed decisions', 'Helps to be more creative', 'Helps to communicate', 'Interferes with other things in life', 'Saves time' ]
validResponse = ['Always or often', 'Always', 'Often', 'Sometimes', 'Rarely or never', 'Rarely', 'Never', "Don't know/refusal/not stated"]
validEstimate = ['Number of persons', 'Percentage of persons', 'Low 95% confidence interval, percent', 'High 95% confidence interval, percent']
validUnit = ['Persons', 'Percent']
//validValue = 

//(validator.isFloat(searchTerms.query['value']) || validator.isInteger(searchTerms.query['value']))
//use validator.isIn(searchTerm, validArray) to check the rest.
}
