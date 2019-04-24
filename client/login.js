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

var prevFunc = "temp";

firebase.auth().onAuthStateChanged(function(user){
    if(user){
      if(prevFunc == "signup"){
        try{
          createNewUser();
          prevFunc == "login"
        }catch(e){
          window.alert(e.message);
        }
      }
      // User is logged in
      window.location.href = "menu";
    }
});

function login(){

  var userEmail = document.getElementById("get_email").value;
  var userPass = document.getElementById("get_pass").value;

  if(!userEmail || !userPass){
    window.alert("email and password can't be empty");
  }
  else{
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then(prevFunc = "login")
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("Error : " + errorCode + "  " + errorMessage);
    });
  }

}

function signup(){
  var userEmail = document.getElementById("get_signup_email").value;
  var userPass = document.getElementById("get_signup_pass").value;

  if(!userEmail || !userPass){
    window.alert("email and password can't be empty");
  }
  else{
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
    .then(prevFunc = "signup")
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("Error : " + errorCode + "  " + errorMessage);
    });
  }
}

function createNewUser(){

  var rootRef = firebase.database().ref().child('users');
  var userRef = rootRef.child(firebase.auth().currentUser.uid);

  userRef.set({
    uid: firebase.auth().currentUser.uid,
    email: firebase.auth().currentUser.email,
    wins: 0,
    played: 0
  }, function(error) {
    if (error) {
      // The write failed...
    } else {
      // Data saved successfully!
    }
  });
}

function logout(){
  firebase.auth().signOut();
  window.location.href = "/";
}

if(window.closed){
  logout();
}