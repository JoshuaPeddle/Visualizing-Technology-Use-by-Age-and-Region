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
        res.status(200).send(objs)
    } else {
        // Let the client know no usages were found
        res.status(200).send("no usages")
    }
}
