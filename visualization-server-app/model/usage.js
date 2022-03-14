const e = require('express');
const client = require('../utils/db');

/**
 * Gets the usage collection
 * @returns The usage collection from MongoDB
 */
 async function _get_usage_collection() {
    let db = await mongo.getDb();
    return await db.collection('usage');
};

class Usage {
    constructor(geo, serviceType, ageGroup, income, uom, value) { //Columns B, D, E, F, G, M 
        this.geo = geo //province/region in canada, or Canada as a whole.
        this.serviceType = serviceType //"Internet at home", "Smart home devices", etc
        this.ageGroup = ageGroup
        this.income = income 
        this.unit = uom //whether  this is number of people or percentage of people.
        //Arguably above should be translated, for display purposes, into either "%" or ""
        //for this model, everything is a percentage - this unit is included for consistency.
        this.value = value 
    }
    static async getUsages(searchTerms){

    let collection = await _get_usage_collection()

    let matching_responses = await collection.find({searchTerms}).toArray(); //I think this is still a promise since there's no function declaration. It may be nessecary, though.
    return matching_responses;
    }
}
module.exports.Usage = Usage