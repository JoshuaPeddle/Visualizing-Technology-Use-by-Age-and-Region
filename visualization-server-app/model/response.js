const e = require('express');
const client = require('../utils/db.js');

async function _get_response_data (){
    let db = await client.getDb();
    return await db.collection('datasets');
};

class Response {
    constructor(geo, ageGroup, sex, question, response, estimate, uom, Scalar_Factor, value) { //Columns B, D, E, F, G, H, I, K and O.  
        this.geo = geo //province/region in canada, or Canada as a whole.
        this.ageGroup = ageGroup
        this.sex = sex //male, female or both sexes for aggregate data.
        this.question = question //"Helps to communicate", "Saves Time" etc
        this.response = response //"Always or often" / "often" / "Sometimes" etc
        this.estimate = estimate // One of: Number of Persons, Percentage of Persons, low 95% CI, High 95% CI
        this.unit = uom //whether  this is number of people or percentage of people.
        //Arguably above should be translated, for display purposes, into either "%" or ""
        if (this.unit != "Persons") {
            this.unitCount = ""
        } 
        else{
        this.unitCount = unitCount
        }
        if (Scalar_Factor == "hundreds") {
            this.unitScalar = 100
        }
        else if (Scalar_Factor == "thousands") {
            this.unitScalar = 1000
        }
        else if (Scalar_Factor == "millions") {
            this.unitScalar = 1000000
        }
        else{
            this.unitScalar = 1
        } //what to multiple value by to get the number of Canadians.
        this.value = value * unitScaler
    }
}