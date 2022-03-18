const Response = require('../model/response').Response;
const fs = require('fs');
let validator = require('validator');

// This constant allows a chose of keeping generated tsv files
// or removing them after sending to client
const keep_tsv = true //this is set to true for submission


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getResponses = async (req,res) =>{
    //need to get search dict from req
    //console.log("req.query below")
    //console.log(req.query)
    let is_valid = validateSearchTerms(req.query)
    if (!is_valid) {
        // If validator says no, return 'invalid query'
        // This is different from "no responses" as you can have "no responses" with a valid query
        res.send("invalid query")
        return
    } 
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


function validateSearchTerms(searchTerms)  {

    //console.log("validateSearchTerms array of searchTerms: ")
    //console.log(searchTerms)
    //These arrays contain all unique entries in our dataset for each column. We validate each search term individually below.
    validGeo = ['Canada', 'Atlantic provinces', 'Newfoundland and Labrador', 'Prince Edward Island', 'Nova Scotia', 'New Brunswick', 'Quebec', 'Ontario', 'Prairie provinces', 'Manitoba', 'Saskatchewan', 'Alberta', 'British Columbia'] //all the sets to input, will do later.
    validAgeGroup = ['Total, 15 years and over', '15 to 24 years','25 to 34 years', '25 to 54 years', '35 to 44 years', '45 to 54 years', '55 to 64 years', '65 years and over', '65 to 74 years', '75 years and over' ] 
    validSex = ['Male', 'Female', 'Both sexes']
    validQuestion = ['Helps make more informed decisions', 'Helps to be more creative', 'Helps to communicate', 'Interferes with other things in life', 'Saves time' ]
    validResponse = ['Always or often', 'Always', 'Often', 'Sometimes', 'Rarely or never', 'Rarely', 'Never', "Don't know/refusal/not stated"]
    validEstimate = ['Number of persons', 'Percentage of persons', 'Low 95% confidence interval, percent', 'High 95% confidence interval, percent']
    validUnit = ['Persons', 'Percent']
    // Validator is not liking undefined values. Say if the search only contains 'geo', 'ageGroup', etc. is undefined
    // Using ternary operator to keep the number of lines manageable but not set on it.
    // If searchTerms['x'] is undefined, then don't validate & return true. Else, validate searchTerms['x'].
    let v1 = searchTerms['value'] == undefined ? true : validator.isFloat(searchTerms['value']) || validator.isInt(searchTerms['value'])
    let v2 = searchTerms['geo'] == undefined ? true : validator.isIn(searchTerms['geo'], validGeo)
    let v3 = searchTerms['ageGroup'] == undefined ? true : validator.isIn(searchTerms['ageGroup'], validAgeGroup)
    let v4 = searchTerms['sex'] == undefined ? true : validator.isIn(searchTerms['sex'], validSex)//
    let v5 = searchTerms['question'] == undefined ? true : validator.isIn(searchTerms['question'], validQuestion)
    let v6 = searchTerms['unit'] == undefined ? true : validator.isIn(searchTerms['unit'], validUnit)
    let v7 = searchTerms['response'] == undefined ? true : validator.isIn(searchTerms['response'], validResponse)
    let v8 = searchTerms['estimate'] == undefined ? true : validator.isIn(searchTerms['estimate'], validEstimate)
    //Check all eight conditions to verify the search is valid.s
    return (v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8) ? true : false
}




async function validateSearchTerms2(searchTerms)  {
searchTerms = searchTerms
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
let v1 = (validator.isFloat(searchTerms['value']) || validator.isInteger(searchTerms['value']))
let v2 = validator.isIn(searchTerms['geo'], validGeo)
let v3 = validator.isIn(searchTerms['ageGroup'], validAgeGroup)
let v4 = validator.isIn(searchTerms['sex'], validSex)
let v5 = validator.isIn(searchTerms['question'], validQuestion)
let v6 = validator.isIn(searchTerms['unit'], validUnit)
let v7 = validator.isIn(searchTerms['response'], validResponse)
let v8 = validator.isIn(searchTerms['estimate'], validEstimate)
//Check all 8 conditions to verify the search is valid.
if(v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8) { //I'm assuming this functions like java but haven't actually verified it does.
    return true
}
else{
    return false
}
}









/**
     * This function accepts an array of posted Response objects, generates a tsv locally and returns a prompt to download the file to the client.
     */
 module.exports.exportTSV = async (req, res) => {
    // Response objects were sent as as stringified JSON
    // Parse data from stringified JSON
    let responses = JSON.parse(req.body.body)
    // Call static function of Response to create the tsv file
    let tsv_file = await Response.toTSV(responses);
    // Use express download function to send tsv file to client
    res.download(tsv_file, async (err) => {
        if (err == undefined && !keep_tsv) { // If no err, and we dont want to keep the tsv, remove it after sending it
            fs.rm(tsv_file,(err)=>{
                if (err) throw err;
                console.log('tsv file created and sent to client')
            })
        }
    })
}