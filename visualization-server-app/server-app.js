//Code skeleton from contacts-app-v4
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); //We now need this for passing Response and Usage objects back to server for export
app.use(express.urlencoded({extended: true}));//incoming objects are strings or arrays

//Import operations here to a const
const mongo = require('./utils/db.js');
const responseController = require('./controller/responses'); //I... think you can have multiple controllers in MVC,
const usageController = require('./controller/usages');// but I don't think the course was explicit anywhere.
var server;

async function createServer(){
  try {
    //make sure database is working before starting
    await mongo.connectToDB();
    //resource paths
    app.get('/responses', responseController.getResponses); //more specific paths may be required? I'm not positive, since we're pulling all matching only..
    app.get('/usages', usageController.getUsages);
    app.post('/usages/tsv', usageController.exportTSV);  // POST has no size restrictions, GET is restricted to 2048 characters.
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