const Usage = require('../model/usage').Usage;
const fs = require('fs');


module.exports.getUsages = async (req, res) => {
    //need to get search dict from req
    console.log(req.query)
    // TODO: Validate req.query
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

async function validateSearchTerms(searchTerms)  {
searchTerms = searchTerms.toArray()
console.log("Array of searchTerms: ")
console.log(searchTerms)
validGeo = ['Canada', 'Atlantic provinces','Quebec', 'Ontario', 'Prairie provinces', 'British Columbia']  //all the sets to input, will do later.
validAgeGroup = ['Total, Internet users aged 15 years and over', 'Internet users aged 15 to 24 years', 'Internet users aged 25 to 44 years', 'Internet users aged 45 to 64 years', 'Internet users aged 65 years and over']     
validServiceType = ['Have access to the Internet at home', 'Use of a smart home devices in primary residence ', 'Have a smartphone for personal use','Have social networking accounts','Used or purchased video streaming services', 'Used or purchased music streaming services', 'Used government services online ', 'Shopped online'] //smart home devices really does have a trailing whitespace. 
validIncome = ['Total, household income quartiles', 'Lowest quartile household income', 'Second quartile household income', 'Third quartile household income','Highest quartile household income']
validUnit = ['Percent']
//validValue = 

let v1 = (validator.isFloat(searchTerms['value']) || validator.isInteger(searchTerms['value']))
let v2 = validator.isIn(searchTerms['geo'], validGeo)
let v3 = validator.isIn(searchTerms['ageGroup'], validAgeGroup)
let v4 = validator.isIn(searchTerms['serviceType'], validServiceType)
let v5 = validator.isIn(searchTerms['income'], validIncome)
let v6 = validator.isIn(searchTerms['unit'], validUnit)
//Check all six conditions to verify the search is valid.
if(v1 && v2 && v3 && v4 && v5 && v6) { //I'm assuming this functions like java but haven't actually verified it does.
    return true
}
else{
    return false
}
}
