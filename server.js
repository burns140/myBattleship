// Setting port
var PORT = process.env.PORT || 3000;

var firebase = require('firebase');
var express = require('express');
var app = express();
var path = require('path');
const bodyParser = require("body-parser");

// Allow static files from client directory to run
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Respond with login page
app.get('/', function(req, res){
  // Send the login page
  res.sendFile(path.join(__dirname,'client','login.html'));
  console.log('login page sent');
});

// Respond with login page
app.get('/login', function(req, res){
  // Send the login page
  res.sendFile(path.join(__dirname,'client','login.html'));
  console.log('login page sent');
});


// Respond with signup page
app.get('/signup', function(req, res){
  res.sendFile(path.join(__dirname,'client','signup.html'));
  console.log('signup page sent')
});

// Respond with menu page
app.get('/menu', function(req, res){
  res.sendFile(path.join(__dirname,'client','menu.html'));
  console.log('menu page sent')
});

// Respond with menu page
app.get('/play', function(req, res){
  res.sendFile(path.join(__dirname,'testgrid.html'));
  console.log('testgrid page sent')
});

// Listen for requests at PORT
app.listen(PORT, function() {
  console.log('Battleship server running on port : '+ PORT);
});