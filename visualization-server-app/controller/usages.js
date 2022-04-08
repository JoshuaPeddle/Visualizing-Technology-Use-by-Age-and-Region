const Usage = require('../model/usage').Usage;
const fs = require('fs');


// This constant allows a chose of keeping generated tsv files
// or removing them after sending to client
const keep_tsv = true //set to true for submission

module.exports.getUsages = async (req, res) => {
    //need to get search dict from req
    //console.log("Req.query Usages below")
    //console.log(req.query)
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

/**
     * This function accepts an array of posted Usage objects, generates a tsv locally and returns a prompt to download the file to the client.
     */
module.exports.exportTSV = async (req, res) => {
    // Usage objects were sent as as stringified JSON
    // Parse data from stringified JSON
    let usages = JSON.parse(req.body.body)
    // Call static function of Usage to create the tsv file
    let tsv_file = await Usage.toTSV(usages);
    // Use express send function to send tsv text to client
    res.send(tsv_file)
}