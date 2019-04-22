var PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();

var http = require('http');

const server = http.Server(app);
const bodyParser = require("body-parser");
var firebase = require("firebase");
require('firebase/auth');
require('firebase/database');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyB38Y5PiCyAoA1jTttFJbN0HliwjkstPvo",
  authDomain: "battleship-92ba9.firebaseapp.com",
  databaseURL: "https://battleship-92ba9.firebaseio.com",
  projectId: "battleship-92ba9",
  storageBucket: "battleship-92ba9.appspot.com",
  messagingSenderId: "67219704226"
});

var auth = firebase.auth();
var db = firebase.database();

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// Respond with login page if user is not logged in
app.get('/', function(req, res){
  auth.onAuthStateChanged(function(user){
    if(user){
      // User is signed in
      var user = firebase.auth().currentUser;
      var email_id = user.email;
      document.getElementById("login-title").innerHTML = "Welcome User: " + email_id;
      
      console.log('user is already logged in')
    }
    else{
      // User is not signed in
      res.sendFile(__dirname + '/client/login.html');
      console.log('login page sent');
    }
  })
});

app.post('/login', function(req, res){
  var email = req.body.email;
  var password = req.body.password;

  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
    auth.signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
  
      window.alert("Error : " + errorMessage);
  
      // ...
    });
  }).catch(function(error){
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  })
  console.log('login post req');
});

// Respond with signup page
app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/client/signup.html')
  console.log('signup page sent')
});

// Sign up user
app.post('/signup', function(req, res){
  var email = req.body.email;
  var password = req.body.password;

  auth.createUserWithEmailAndPassword(email, password).catch(function(error){
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

  console.log('signup post req');
});

app.listen(PORT, function() {
  console.log('Battleship server running on port '+PORT);
});

var io = require('socket.io')(server);