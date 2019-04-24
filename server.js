// Setting port
var PORT = process.env.PORT || 3000;

var firebase = require('firebase');
var express = require('express');
var app = require('express')();

var http = require('http').createServer(app);
var path = require('path');
const bodyParser = require("body-parser");
var io = require('socket.io')(http);
var playernum = 0;

io.on('connection', function(socket) {
	io.emit('setusernum', playernum);
	console.log(playernum);
	console.log("user connected");
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('clicked', function(msg) {
		console.log('somebody shot something');
		io.emit('clicked', msg);
	});
	socket.on('ended', function(msg) {
		playernum = 0;
	});
});

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
app.get('/testgrid', function(req, res){
  playernum++;
	if (playernum > 2) {
		res.end('<h1>Room is full</h1>');
		return;
	}
  res.sendFile(__dirname,'client','testgrid.html');
  console.log('testgrid page sent')
});

// Listen for requests at PORT
http.listen(PORT, function() {
  console.log('Battleship server running on port : '+ PORT);
});