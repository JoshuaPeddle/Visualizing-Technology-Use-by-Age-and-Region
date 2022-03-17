const Usage = require('../model/usage').Usage;
const fs = require('fs');
let validator = require('validator');


// This constant allows a chose of keeping generated tsv files
// or removing them after sending to client
const keep_tsv = false

module.exports.getUsages = async (req, res) => {
    //need to get search dict from req
    console.log("Req.query Usages below")
    console.log(req.query)
    let is_valid = validateSearchTerms(req.query)
    if (!is_valid) {
         // If validator says no, return 'invalid query'
        // This is different from "no usages" as you can have "no usages" with a valid query
        res.send("invalid query")
        return
    } 
    let objs = await Usage.getUsages(req.query);
    // This is just a simple check to see if anything was returned
    if (objs.length >= 1) {
        // If we have usages, send them to client
        res.send(objs)
    } else {
        // Let the client know no usages were found
        res.send("no usages")
    }
}


 function validateSearchTerms(searchTerms)  {

     console.log("validateSearchTerms array of searchTerms: ")
     //console.log(searchTerms)
     validGeo = ['Canada', 'Atlantic provinces', 'Quebec', 'Ontario', 'Prairie provinces', 'British Columbia']  //all the sets to input, will do later.
     validAgeGroup = ['Total, Internet users aged 15 years and over', 'Internet users aged 15 to 24 years', 'Internet users aged 25 to 44 years', 'Internet users aged 45 to 64 years', 'Internet users aged 65 years and over']
     validServiceType = ['Have access to the Internet at home', 'Use of a smart home devices in primary residence ', 'Have a smartphone for personal use', 'Have social networking accounts', 'Used or purchased video streaming services', 'Used or purchased music streaming services', 'Used government services online ', 'Shopped online'] //smart home devices really does have a trailing whitespace. 
     validIncome = ['Total, household income quartiles', 'Lowest quartile household income', 'Second quartile household income', 'Third quartile household income', 'Highest quartile household income']
     validUnit = ['Percent']
     // Validator is not liking undefined values. Say if the search only contains 'geo', 'ageGroup', etc. is undefined
     // Using ternary operator to keep the number of lines manageable but not set on it.
     // If searchTerms['x'] is undefined, then don't validate & return true. Else, validate searchTerms['x'].
     let v1 = searchTerms['value'] == undefined ? true : validator.isFloat(searchTerms['value']) || validator.isInteger(searchTerms['value'])
     let v2 = searchTerms['geo'] == undefined ? true : validator.isIn(searchTerms['geo'], validGeo)
     let v3 = searchTerms['ageGroup'] == undefined ? true : validator.isIn(searchTerms['ageGroup'], validAgeGroup)
     let v4 = searchTerms['serviceType'] == undefined ? true : validator.isIn(searchTerms['serviceType'], validServiceType)//
     let v5 = searchTerms['income'] == undefined ? true : validator.isIn(searchTerms['income'], validIncome)
     let v6 = searchTerms['unit'] == undefined ? true : validator.isIn(searchTerms['unit'], validUnit)
     //let v6 = validator.isIn(searchTerms['unit'], validUnit)
     //Check all six conditions to verify the search is valid.s
     return (v1 && v2 && v3 && v4 && v5 && v6) ? true : false
}


/**
     * This function accepts an array of posted Usage objects, generates a tsv locally and returns a prompt to download the file to the client.
     */
module.exports.exportTSV = async (req, res) => {
    // Usage objects were sent as as stringified JSON
    // Parse data from stringified JSON
    let usages = JSON.parse(req.body.body)
    // Call static function of Usage to create the tsv file
    let tsv_file = await Usage.toTSV(usages);
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