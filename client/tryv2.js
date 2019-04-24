// Initialize Firebase
var config = {
  apiKey: "AIzaSyB38Y5PiCyAoA1jTttFJbN0HliwjkstPvo",
  authDomain: "battleship-92ba9.firebaseapp.com",
  databaseURL: "https://battleship-92ba9.firebaseio.com",
  projectId: "battleship-92ba9",
  storageBucket: "battleship-92ba9.appspot.com",
  messagingSenderId: "67219704226"
};
try{
  if(!firebase.apps.length){
    firebase.initializeApp(config);
  }
}catch(e){
  console.log(e.message);
};

function doOnce(){
	var userRef = firebase.database().ref().child('users');
	
	userRef.once("value", function(snapshot) {
	snapshot.forEach(function(childSnapshot){
	    var value = childSnapshot.val();
	
		
		var newRef = userRef.child(childSnapshot.key);
		var played1 = value.played;
		played1++;
		newRef.update({played: played1});
	
});
});
}
try{
	doOnce();
}catch(e){
	console.log(e.message);
}

// set grid rows and columns and the size of each square
var rows = 10;
var cols = 10;
var squareSize = 50;
var usernum = -1;
var blocksPlacedMe = 0;
var blocksPlacedThem = 0;
var maxBlocks = 10;
var playerTurn = 0;
var ended = 0;
var myTurn = 0;
var placed = 0;
var socket = io();
var gameBoard = [
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
				];

var gameBoard2 = [
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
				];

// get the container element
var gameBoardContainer = document.getElementById("gameboard");
var gameBoardContainer2 = document.getElementById("gameboard2");

// make the grid columns and rows
for (i = 0; i < cols; i++) {
	for (j = 0; j < rows; j++) {
		
		// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div");
		gameBoardContainer.appendChild(square);

    // give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i + '1';			
		
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;			
		
		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';						
	}
}

// make the grid columns and rows
for (i = 0; i < cols; i++) {
	for (j = 0; j < rows; j++) {
		
		// create a new div HTML element for each grid square and make it the right size
		var square = document.createElement("div");
		gameBoardContainer2.appendChild(square);

    // give each div element a unique id based on its row and column, like "s00"
		square.id = 's' + j + i + '2';			
		
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * squareSize;
		var leftPosition = i * squareSize;			
		
		// use CSS absolute positioning to place each grid square on the page
		square.style.top = topPosition + 'px';
		square.style.left = leftPosition + 'px';						
	}
}



$(function() {
	gameBoardContainer.addEventListener('click', function(e) {
		if (blocksPlacedMe < maxBlocks && placed == 0) {
			e.preventDefault();
			placeShips(e.target.id, 0);
			socket.emit('clicked', e.target.id + usernum);
			return false;
		} else {
			return false;
		}
		
	});
	gameBoardContainer2.addEventListener('click', function(e) {
		console.log('placed: ' + placed);
		console.log('myTurn: ' + myTurn);
		if (placed == 1 && myTurn == 1) {
			e.preventDefault();
			shotShip(e.target.id, 0);
			socket.emit('clicked', e.target.id + usernum);
			//console.log('send clicked 2');
			return false;
		} else {
			return false;
		}
		
	});
	socket.on('clicked', function(msg) {
		//console.log('received clicked');
		//console.log('e.target on received: ' + msg.id);
		if (ended == 0) {
			if ((blocksPlacedMe != maxBlocks || blocksPlacedThem != maxBlocks) && (placed == 0)) {
				placeShips(msg, 1);
				console.log('blocksPlacedThem: ' + blocksPlacedThem);
				console.log('blocksPlacedMe: ' + blocksPlacedMe);
			} else {
				console.log('setting placed');
				if (placed == 0) {
					placed = 1;
					socket.emit('placed', 'placed');
				}
				shotShip(msg, 1);
			}
		}
	});
	socket.on('setusernum', function(msg) {
		playercount = msg;
		console.log('playercount in set: ' + playercount);
		if (usernum === -1) {
			usernum = msg;
			console.log('setting usernum: ' + usernum);
			if (usernum % 2 == 1) {
				myTurn = 1;
			}
			if (usernum == 1 && playercount == 1) {
				document.getElementById("p1").innerHTML = "Waiting for other players.";
			} else {
				console.log('players placing ships');
				document.getElementById("p1").innerHTML = "Players placing ships. Place ten ships by clicking on top grid.";
			}
		}
	});
	socket.on('placed', function(msg) {
		if (myTurn == 1) {
			document.getElementById("p1").innerHTML = "Your turn. Fire at enemies by clicking on bottom grid."
		} else {
			document.getElementById("p1").innerHTML = "Their turn";
		}
		placed = 1;
	});
	socket.on('ended', function(msg) {
		if (blocksPlacedThem != 0) {
			window.alert('Other player won');
		} 
	});
});

function shotShip(str1, num) {
	console.log('shotship');
	var str = str1.substring(0, 4);
	var me = str1.substring(4, 5);
	if (usernum != me) {
		myTurn = 1;
		console.log('my turn now');
		document.getElementById("p1").innerHTML = "Your turn. Fire at enemies by clicking on bottom grid.";
	}
	if (usernum == me && num !== 0) {
		return;
	}
	if (num == 0) {	
		//console.log(str);
		var element = document.getElementById(str);
		var row = str.substring(1, 2);
		var col = str.substring(2, 3);
		if (gameBoard2[row][col] == 0) {
			gameBoard2[row][col] = 1;
			element.style.background = 'red';
			blocksPlacedThem--;
			//evt.stopPropagation();
			//return;
		} else {
			element.style.background = 'black';
			//evt.stopPropagation();
			//return;
		}
		myTurn = 0;
		document.getElementById("p1").innerHTML = "Their turn";
	} else if (num == 1) {
		console.log('received request from other person');
		var str2 = '';
		if (str.substring(3, 4) == '1') {
			str2 = str.substring(0, 3) + '2';
		} else {
			str2 = str.substring(0, 3) + '1';
		}
		var element = document.getElementById(str2);
		var row = str2.substring(1, 2);
		var col = str2.substring(2, 3);
		if (gameBoard[row][col] == 0) {
			gameBoard[row][col] = 1;
			element.style.background = 'red';
			blocksPlacedMe--;
			//evt.stopPropagation();
			if (blocksPlacedMe == 0) {
				ended = 1;
			}
			//return;
		} else {
			element.style.background = 'black';
			//evt.stopPropagation();
			//return;
		}
		//console.log('myturn before switch: ' + myTurn);
		myTurn = 1;
		document.getElementById("p1").innerHTML = "Your turn. Fire at enemies by clicking on bottom grid.";
		//console.log('myturn after switch: ' + myTurn);
	}
	if (blocksPlacedMe == 0 || blocksPlacedThem == 0) {
		if (blocksPlacedMe == 0) {
			window.alert('Other player won');
			document.getElementById("p1").innerHTML = "Game Ended";
			socket.emit('ended', 'ended');
		} else {
			
			var userRef = firebase.database().ref().child('users');

			userRef.once("value", function(snapshot) {
				snapshot.forEach(function(childSnapshot){
				  var value = childSnapshot.val();
				  if(value.email == firebase.auth().currentUser.email){
					  var newRef = userRef.child(childSnapshot.key);
					  var wins1 = value.wins;
					  wins1++;
					  newRef.update({wins: wins1});
				  }
				});
			});
			window.alert('You won!');
			document.getElementById("p1").innerHTML = "Game Ended";
		}
		ended = 1;
	}
}

function placeShips(str1, num) {
	//console.log('placing');
	var str = str1.substring(0, 4);
	var me = str1.substring(4, 5);
	//console.log(str);
	//console.log(me);
	if (usernum == me && num !== 0) {
		return;
	}
	if (num == 0) {
		var element = document.getElementById(str);
		var row = str.substring(1, 2);
		var col = str.substring(2, 3);
		if (gameBoard[row][col] == 0) {
			// do nothing
		} else {
			gameBoard[row][col] = 0;
			blocksPlacedMe++;
			element.style.background = 'green';
		}
	} else if (num == 1) {
		var str2 = '';
		if (str.substring(3, 4) == '1') {
			str2 = str.substring(0, 3) + '2';
		} else {
			str2 = str.substring(0, 3) + '1';
		}
		var element = document.getElementById(str2);
		var row = str2.substring(1, 2);
		var col = str2.substring(2, 3);
		if (gameBoard2[row][col] == 0) {
			//do nothing
		} else {
			gameBoard2[row][col] = 0;
			blocksPlacedThem++;
		}
	}

	//evt.stopPropagation();

	return;

}


