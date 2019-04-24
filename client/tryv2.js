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

/* lazy way of tracking when the game is won: just increment hitCount on every hit
   in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
   there are 17 hits to be made in order to win the game:
      Carrier     - 5 hits
      Battleship  - 4 hits
      Destroyer   - 3 hits
      Submarine   - 3 hits
      Patrol Boat - 2 hits
*/
var hitCount = 0;

/* create the 2d array that will contain the status of each square on the board
   and place ships on the board (later, create function for random placement!)

   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
*/


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
		if (blocksPlacedMe == maxBlocks && blocksPlacedThem == maxBlocks && myTurn == 1) {
			e.preventDefault();
			shotShip(e.target.id, 0);
			socket.emit('clicked', e.target.id + usernum);
			console.log('send clicked 2');
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
				//console.log('blocksPlacedThem: ' + blocksPlacedThem);
				//console.log('blocksPlacedMe: ' + blocksPlacedMe);
				placeShips(msg, 1);
			} else {
				placed = 1;
				shotShip(msg, 1);
			}
		}
	});
	socket.on('setusernum', function(msg) {
		if (usernum === -1) {
			usernum = msg;
			if (usernum == 1) {
				myTurn = 1;
			}
		}
	});
});

function shotShip(str1, num) {
	console.log('shotship');
	var str = str1.substring(0, 4);
	var me = str1.substring(4, 5);
	if (usernum == me && num !== 0) {
		return;
	}
	if (num == 0) {	
		console.log(str);
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
		myTurn = 1;
	}
	if (blocksPlacedMe == 0 || blocksPlacedThem == 0) {
		ended = 1;
	}
}

function placeShips(str1, num) {
	console.log('placing');
	var str = str1.substring(0, 4);
	var me = str1.substring(4, 5);
	console.log(str);
	console.log(me);
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

// set event listener for all elements in gameboard, run fireTorpedo function when square is clicked
/**gameBoardContainer.addEventListener("click", fireTorpedo, false);

// initial code via http://www.kirupa.com/html5/handling_events_for_many_elements.htm:
function fireTorpedo(e) {
    // if item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
	if (e.target !== e.currentTarget) {
        // extract row and column # from the HTML element's id
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
        //alert("Clicked on row " + row + ", col " + col);
				
		// if player clicks a square with no ship, change the color and change square's value
		if (gameBoard[row][col] == 0) {
			e.target.style.background = '#bbb';
			// set this square's value to 3 to indicate that they fired and missed
			gameBoard[row][col] = 3;
			
		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoard[row][col] == 1) {
            e.target.style.background = 'red';
			// set this square's value to 2 to indicate the ship has been hit
			gameBoard[row][col] = 2;
			
			// increment hitCount each time a ship is hit
			hitCount++;
			// this definitely shouldn't be hard-coded, but here it is anyway. lazy, simple solution:
			if (hitCount == 17) {
				alert("All enemy battleships have been defeated! You win!");
			}
			
		// if player clicks a square that's been previously hit, let them know
		} else if (gameBoard[row][col] > 1) {
			alert("Stop wasting your torpedos! You already fired at this location.");
		}		
    }
    e.stopPropagation();
}**/
