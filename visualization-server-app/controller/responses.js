const Response = require('../model/response').Response;
const fs = require('fs');

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
    // Enable caching of requests for responses
    // Each requests url is unique and it can be assumed we wont be modifying individual values in our dataset.
    // Therefore a long cache will reduce overall requests without affecting the end user
    res.set('Cache-Control', 'public, max-age=31557600');
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


/**
     * This function accepts an array of posted Response objects, generates a tsv locally and returns a prompt to download the file to the client.
     */
 module.exports.exportTSV = async (req, res) => {
    // Response objects were sent as as stringified JSON
    // Parse data from stringified JSON
    let responses = JSON.parse(req.body.body)
    // Call static function of Response to create the tsv file
    let tsv_file = await Response.toTSV(responses);
    // Use express send function to send tsv text to client
    res.send(tsv_file)
}