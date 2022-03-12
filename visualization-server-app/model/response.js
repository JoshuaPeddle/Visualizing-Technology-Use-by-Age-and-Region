const e = require('express');
const mongo = require('../utils/db.js');

/**
 * Gets the response collection
 * @returns The response collection from MongoDB
 */
async function _get_response_collection() {
    let db = await mongo.getDb();
    return await db.collection('response');
};



class Response {
    constructor(geo, ageGroup, sex, question, response, estimate, uom, value) { //Columns B, D, E, F, G, H, I, K and O.  
        this.geo = geo //province/region in canada, or Canada as a whole.
        this.ageGroup = ageGroup
        this.sex = sex //male, female or both sexes for aggregate data.
        this.question = question //"Helps to communicate", "Saves Time" etc
        this.response = response //"Always or often" / "often" / "Sometimes" etc
        this.estimate = estimate // One of: Number of Persons, Percentage of Persons, low 95% CI, High 95% CI
        this.unit = uom //whether  this is number of people or percentage of people.
        //Arguably above should be translated, for display purposes, into either "%" or ""
        this.value = 0;

        if (this.unit == "Persons") {
            // I discovered only thousands is used in the dataset
            this.value = value * 1000
        }
        else {  // In this case, this.unit == "Percent" so no multiplication needed
            this.value = value
        }
    }

}
module.exports.Response = Response