var socket = io();

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBD-0alEnH2GSG4-ap3JiGhDHi0M5MFhSg",
    authDomain: "event-planner-2bed5.firebaseapp.com",
    databaseURL: "https://event-planner-2bed5.firebaseio.com",
    projectId: "event-planner-2bed5",
    storageBucket: "event-planner-2bed5.appspot.com",
    messagingSenderId: "654317062394"
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
    document.getElementById("signup-form").addEventListener("submit",signup,false);
    document.getElementById("signin-form").addEventListener("submit",login,false);
    
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

function signup(){
  var userEmail = document.getElementById("get_signup_email").value;
  var userPass = document.getElementById("get_signup_pass").value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
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