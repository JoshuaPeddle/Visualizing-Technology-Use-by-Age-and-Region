const e = require('express');
const mongo = require('../utils/db');
const fs = require('fs');

/**
 * Gets the response collection
 * @returns The response collection from MongoDB
 */
async function _get_response_collection() {
    let db = await mongo.getDb();
    return await db.collection('response');
};



class Response {
    constructor(geo, ageGroup, sex, question, response, estimate, uom, value) { //Columns B, D, E, F, G, H, I, and O.  of the .csv file.
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


    /**
     * This static method for the class Response will retrieve
     * all the responses returned by querying the searchTerms
     * @returns {Array[Response]} - An array with all responses retrieved
     */
    static async getResponses(searchTerms){

        let collection = await _get_response_collection()
        searchTerms['value'] == undefined ? 0: searchTerms['value'] = parseFloat(searchTerms['value'])
        let matching_responses = await collection.find(searchTerms).toArray(); //I think this is still a promise since there's no function declaration. It may be nessecary, though.
        console.log("found", matching_responses.length)
        return matching_responses;
    }


    /**
           * This  method for the class Response receives an array of type Response
           * and generates a tsv representation of the objects. It returns the filename of the generated file.
           * @param {Response[]} responses Array of Response objects to be saved to tsv
           * @returns {String} filename - local file reference to generated tsv file
           */
    static async toTSV(responses) {
        const filename = "/response_export.tsv"
        const header = "Geo\tAge Group\tSex\tQuestion\tResponse\tEstimate\tuom\tValue"
        // Write the header
        await fs.promises.writeFile('model' + filename, header, { flag: 'w' })

        let to_write = ""
        responses.forEach((el) => {
            // el is in string dict notation, use Object.values to get the Response objects
            let objs = Object.values(el)
            // We have to slice off 1 here since were passing a mongoDB object (_id: xyz)
            // This will have to be changed if we fix getResponses to return Response objects instead of mongo Objects
            objs.slice(1).forEach(sub_el => {
                to_write = to_write.concat(sub_el, '\t')
            })
            to_write = to_write.concat('\n')


        })
        await fs.promises.appendFile('model' + filename, to_write)

        return __dirname + filename;

    }







    
}
module.exports.Response = Response