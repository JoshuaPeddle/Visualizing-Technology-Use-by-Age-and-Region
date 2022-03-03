//Code skeleton from contacts-app-v4
const express = require('express');
const app = express();
const port = 3000;

//we may not need these, but left for the moment.
app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays

//Import operations here to a const
const mongo = require('./utils/db.js');

var server;

async function createServer(){
  try {
    //make sure database is working before starting
    await mongo.connectToDB();
    //resource paths

    // start the server
    server = app.listen(port, () => {
      console.log('listening at http://localhost:%d', port);
    });
  }
  
  catch(err){
    console.log(err)
  }
}
createServer();
//Kill connection to database when no longer needed
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  server.close(async function(){
    let msg = await mongo.closeDBConnection()   ;
    console.log(msg);
  });
});