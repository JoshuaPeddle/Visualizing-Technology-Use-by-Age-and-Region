//Skeleton from contacts-app-v4
var assert = require('assert');
const { response } = require('../model/response');
const validation = require('../utils/validate-fields')
const axios = require('axios');
var myurl = 'http://localhost:3000';           
// Let's configure the base url
const instance = axios.create({
    baseURL: myurl,
    timeout: 5000, //5 seconds max
    headers: {'content-type': 'application/json'}
});