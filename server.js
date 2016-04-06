//Lets require/import the HTTP module
var http = require('http');
var express = require('express');

//Lets define a port we want to listen to
const PORT=8080;

//Create a server
var server = express();
server.use(express.static(__dirname));

/*
Schnittstelle zur Datenbank später hier rein
server.get('*', function(req, res){
    res.sendFile('index.html');
});
*/

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
    console.log("Server dirname", __dirname);
});