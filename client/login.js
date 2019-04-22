var socket = io();

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

firebase.auth().onAuthStateChanged(function(user) {
  
  if(user){
    // User is signed in

    var user = firebase.auth().currentUser;

    if(user != null){
      
      var email_id = user.email;
      document.getElementById("login-title").innerHTML = "Welcome User: " + email_id;

    }
  }
  else{
    // User is not signed in

    /*var form = document.querySelector('signin-form');

    form.addEventListener('submit')
    */
  }
});



function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}