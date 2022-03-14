const Port = 3000;
//const axios = require('axios').default
const fs = require('fs');
var myurl = `http://0.0.0.0:${Port}`; //localhost broke things so changed to 0.0.0.0 in all locations (localhost is not configured on my machine)

// const instance = axios.create({
//     baseURL: myurl,
//     timeout: 10000, //10 seconds max, modified so it runs on my machine
//     headers: { 'content-type': 'application/json' } //This header not useful to us, but we can use our own custom header if we need to.
//Not if we need axios at all really, our only non-web client example includes it though, so it's here if can't do everything from the web.
// });




/**
 * The main execution of the client side.
 * Uses two command line arguments.
 * If you are in the A2 folder, do node client/client.js 1 3
 * Where the two arguments are integers between 1-5
 */
async function main(){
    //make a placeholder request to the server
}