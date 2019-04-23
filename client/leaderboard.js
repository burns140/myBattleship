// Initialize Firebase
var config = {
    apiKey: "AIzaSyB38Y5PiCyAoA1jTttFJbN0HliwjkstPvo",
    authDomain: "battleship-92ba9.firebaseapp.com",
    databaseURL: "https://battleship-92ba9.firebaseio.com",
    projectId: "battleship-92ba9",
    storageBucket: "battleship-92ba9.appspot.com",
    messagingSenderId: "67219704226"
  };
  firebase.initializeApp(config);

var userRef = firebase.database().ref().child('users');

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
  