const e = require('express');
const mongo = require('../utils/db');
const fs = require('fs');

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



    /**
     * This static method for the class Usage will retrieve
     * all the usages returned by querying the searchTerms
     * @returns {Array[Usage]} - An array with all usage retrieved
     */
    static async getUsages(searchTerms){

        let collection = await _get_usage_collection()
        // Check if 'value' is included in searchTerms, if so it may be a string so parse to float
        searchTerms['value'] == undefined ? 0: searchTerms['value'] = parseFloat(searchTerms['value'])
        let matching_responses = await collection.find(searchTerms).toArray(); //I think this is still a promise since there's no function declaration. It may be nessecary, though.
        console.log("found", matching_responses.length)
        return matching_responses;
    }


    /**
       * This  method for the class Usage receives an array of type Usage
       * and generates a tsv representation of the objects. It returns the filename of the generated file.
       * @param {Usage[]} usages Array of Usage objects to be saved to tsv
       * @returns {String} filename - local file reference to generated tsv file
       */
    static async toTSV(usages) {
        const filename = "/usage_export.tsv"
        const header = "Geo\tService Type\tAge Group\tHousehold Income Quartile\tuom\tValue\n"
        // Write the header
        await fs.promises.writeFile('model' + filename, header, { flag: 'w' })

        let to_write = ""
        usages.forEach((el) => {
            // el is in string dict notation, use Object.values to get the Usage objects
            let objs = Object.values(el)
            // We have to slice off 1 here since were passing a mongoDB object (_id: xyz)
            // This will have to be changed if we fix getUsages to return Usage objects instead of mongo Objects
            objs.slice(1).forEach(sub_el => {
                to_write = to_write.concat(sub_el, '\t')
            })
            to_write = to_write.concat('\n')


        })
        await fs.promises.appendFile('model' + filename, to_write)

        return __dirname + filename;

    }




}
module.exports.Usage = Usage