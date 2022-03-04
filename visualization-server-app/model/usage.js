const e = require('express');
const client = require('../utils/db.js');

async function _get_response_data (){
    let db = await client.getDb();
    return await db.collection('datasets');
};

class Usage {
    constructor(geo, serviceType, ageGroup, income, uom, value) { //Columns B, D, E, F, G, M 
        this.geo = geo //province/region in canada, or Canada as a whole.
        this.serviceType //"Internet at home", "Smart home devices", etc
        this.ageGroup = ageGroup
        this.unit = uom //whether  this is number of people or percentage of people.
        //Arguably above should be translated, for display purposes, into either "%" or ""
        //for this model, everything is a percentage - this unit is included for consistency.
        this.value = value 
    }
}