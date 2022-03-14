const Response = require('../model/response').Response;
const fs = require('fs');



/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.getResponses = async (req,res) =>{
    //need to get search dict from req
    console.log(req.query)
    // TODO: Validate req.query
    let objs = await Response.getResponses(req.query);
    // This is just a simple check to see if anything was returned
    if (objs.length >=1){
        // If we have requests, send them to client
        res.status(200).send(objs)
    }else{
        // Let the client know no requests were found
        res.status(200).send("no responses")
    }
}