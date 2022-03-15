/*
 *  This file is meant to be run as a standalone script.
 *  Used to build mongo database.
 *  The database name is defined in utils/db.js
 *  "Opinions on technology" is stored in collection 'response'
 *  "Uses of Technology" is stored in collection 'usage'
 * 
 */


const fs = require('fs');
const mongo = require('./db.js');
const Response = require('../model/response').Response;
const Usage = require('../model/usage').Usage;
const axios = require('axios');
var myurl = 'http://localhost:3000';  
const instance = axios.create({
    baseURL: myurl,
    timeout: 5000, //5 seconds max
    headers: { 'content-type': 'application/json' }
});
/**
 * Gets the response collection
 * @returns The response collection from MongoDB
 */
async function _get_response_collection() {
    let db = await mongo.getDb();
    return await db.collection('response');
};


/**
 * Gets the usage collection
 * @returns The usage collection from MongoDB
 */
async function _get_usage_collection() {
    let db = await mongo.getDb();
    return await db.collection('usage');
};

/**
 * Creates two collections in mongo database 'datasets'
 *  "Opinions on technology" is stored in collection 'response'
 *  "Uses of Technology" is stored in collection 'usage'
 *  @returns 'success' if everything worked
 */
async function buildDB() {
    // Connect to our DB
    await mongo.connectToDB();

    // Get our response collection
    let responseCollection = await _get_response_collection();
    // Read 'datasets\Use of Technology by Age.tsv' 
    let responseData = fs.readFileSync("../datasets/Opinions on Technology.tsv", 'utf8');
    // Empty list to store the Response objects
    let responseArray = []
    //check if the database already exists before continuing. 
    let res = await instance.get('/responses', { params: {} })

    if (res.data.length == 62400) {
        console.log("Responses DB already exists")
        //return("DB already exists.") //leave this commented out, or it will early-abort and not check Usages.
    }
    //Split the data by lines and construct Response objects
    // Slice off header data
    else {responseData.split('\n').slice(start = 1).forEach(async (el) => {
        let rawData = el.split("\t");
        // Construct response from split data
        let newResponse = new Response(rawData[1], rawData[3], rawData[4], rawData[5], rawData[6], rawData[7], rawData[8], rawData[14])
        // Add to array
        responseArray.push(newResponse)
       
    })
    // Add all Responses at once to collection 'response'
    await responseCollection.insertMany(responseArray)
    }

    // Repeat the above process for 'Use of Technology by Age.tsv'

    let usageCollection = await _get_usage_collection();
    let usageData = fs.readFileSync("../datasets/Use of Technology by Age.tsv", 'utf8');
    let usageArray = []
    res = await instance.get('/usages', { params: {} })

    if (res.data.length == 1200) {
        //console.log("Usages DB already exists")
        return("Usages DB already exists.")
    }
    else{usageData.split('\n').slice(start = 1).forEach(async (el) => {
        let rawData = el.split("\t");
        //console.log(rawData)
        let newUsage = new Usage(rawData[1], rawData[3], rawData[4], rawData[5], rawData[6], rawData[12])
        // Add to array
        usageArray.push(newUsage)
    })
    await usageCollection.insertMany(usageArray)

    return "DB creation succesful."
}
}



buildDB()
    .then((res) => {
        //console.log("DB creation successful")
        console.log(res)
        mongo.closeDBConnection();
    })
    .catch((err) => {
        console.log(err);
    });
