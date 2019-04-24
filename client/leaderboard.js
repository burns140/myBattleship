// Initialize Firebase
var config = {
    apiKey: "AIzaSyB38Y5PiCyAoA1jTttFJbN0HliwjkstPvo",
    authDomain: "battleship-92ba9.firebaseapp.com",
    databaseURL: "https://battleship-92ba9.firebaseio.com",
    projectId: "battleship-92ba9",
    storageBucket: "battleship-92ba9.appspot.com",
    messagingSenderId: "67219704226"
  };
  if(!firebase.apps.length){
    firebase.initializeApp(config);
  }

var userRef = firebase.database().ref().child('users');
var tbodycontainer = document.getElementById("tbody")
// Attach an asynchronous callback to read the data at our users reference
userRef.on("value", function(snapshot) {
  var arr = [];
  snapshot.forEach(function(childSnapshot){
    var value = childSnapshot.val();
    arr.push(value);
  });
  var i = 1;
  arr.sort(mycompare);
  for(var j=0; j < arr.length; j++){
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    td1.textContent = i;
    td2.textContent = arr[j].email;
    td3.textContent = arr[j].played;
    td4.textContent = arr[j].wins;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tbodycontainer.appendChild(tr);
    i+=1;
  }
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function mycompare(a, b){
  if(a.wins < b.wins) return 1;
  if(b.wins < a.wins) return -1;
  return 0;
}
  