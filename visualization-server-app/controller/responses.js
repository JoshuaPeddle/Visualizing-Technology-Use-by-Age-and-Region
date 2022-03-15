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
    this.validateSearchTerms(req.query) // not hooked up properly
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

function validateSearchTerms (searchTerms)  {
validGeo = {} //all the sets to input, will do later.
validAgeGroup = {} 
validSex = {}
validQuestion = {}
validResponse = {}
validEstimate = {}
validUom = {}
//validValue = 
(validator.isFloat(searchTerms.query['value']) || validator.isInteger(searchTerms.query['value']))
//use validator.isIn(searchTerm, validArray) to check the rest.
}
