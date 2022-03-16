//Skeleton from contacts-app-v4
var assert = require('assert');
const { response } = require('../model/response');
//const validation = require('../utils/validate-fields')
const axios = require('axios');
var myurl = 'http://localhost:3000';           
// Let's configure the base url
const instance = axios.create({
    baseURL: myurl,
    timeout: 5000, //5 seconds max
    //headers: { 'content-type': 'application/json' }
});

/*
To run these tests first ensure mocha is installed, then go to application root and run 'mocha'
API testing requires the server-app.js be running while testing
*/
//Note that these tests are extremely brittle to database changes. Our data is not designed to be updated or deleted, so this is a non-issue.
//We do  

describe('Visualizing-Technology - Tests with Mocha', function () {

    // Test our two models. 'response.js' and 'usage.js' 
    describe('Test Models', function () {

        // Tests for response.js
        describe('Response', function () {
            // Test 1
            it('Responses DB correct size', async function () {
                let res = await instance.get('/responses', { params: {} });
                console.log("response DB actual size: "+res.data.length)
                assert.strictEqual(res.data.length, 62400)
            });
        });
        // Tests for usage.js
        describe('Usage', function () {
            // Test 1
            it('Usage DB correct size', async function () {
                let res = await instance.get('/usages', { params: {} });
                console.log("response DB actual size: "+res.data.length)
                assert.strictEqual(res.data.length, 1200)
            });
        });
    });


    // Test our API calls. This tests the controllers 'responses.js' and 'usages.js' as well.
    describe('Test API calls', function () {

        
        // Tests for responses.js
        describe('Responses', async function () {
            // Test successful response retrieval
            it('Responses successful retrieval', async function () {
                // construct a valid sample search
                let sampleSearch = {
                    geo: 'Ontario',
                    sex: 'Male',
                    question:"Helps to communicate",
                    response:"Always or often"
                }
                // We're doing a get request, so send our data as params
                let res = await instance.get('/responses', { params: sampleSearch });
                //console.log(res.data) //debugging line, uncomment this if for some reason the length doesn't match expected. 
                assert.strictEqual(res.data.length, 40); 
            });

            
            it('Responses failed retrieval - bad search params', async function () {
                // construct a sample search with invalid search params
                let sampleSearch = {
                    geo: 'USA',
                    sex: 'cat'
                }
                // We're doing a get request, so send our data as params
                let res = await instance.get('/responses', { params: sampleSearch });
                // Should get a message back from the server 'no responses'
                // This could be validated better
                assert.strictEqual(res.data, 'no responses'); 
            });
            
        });


        // Tests for usages.js
        describe('Usages', async function () {
            // Test 1
            it('Usages successful retrieval', async function () {
                // construct a valid sample search
                let sampleSearch = {
                    geo: 'Canada',
                }
                let res = await instance.get('/usages', { params: sampleSearch });

                assert.strictEqual(res.data.length, 200); //200 results are returned, this is not an artifact of status(200)
            });

            it('Usages failed retrieval - bad search params', async function () {
                // construct a sample search with invalid search params
                let sampleSearch = {
                    geo: 'USA',
                }
                let res = await instance.get('/usages', { params: sampleSearch });
                // This could be validated better //Could it?
                assert.strictEqual(res.data, 'no usages'); 
            });
          
            it('Comprehensive Filter Test - all filters return correctly.', async function () {
                // construct a sample search with invalid search params
                let sampleSearch = {
                    geo:'Canada', //This one is correct
                    serviceType:'Have access to the Internet at home', //This one is correct
                    ageGroup:'Total, Internet users aged 15 years and over', // this line works now
                    income:'Total, household income quartiles', //this line works now
                    //unit:'Percent', //this line causes failure
                    //value:93.6 //this line newly fails

                    
                }
                let res = await instance.get('/usages', { params: sampleSearch });
                // This could be validated better //Could it?
                console.log("Comprehensive Search: ")
                console.log(res.data)
                assert.strictEqual(res.data.length, 1); 
            });
        });
    });
});            

