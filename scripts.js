//Get form data ===============================
let modalStart = document.getElementById('modal-start');
let mark;
let comMark;
let difficulty;
let winner;
let isWinner = false;
let xScore = 0;
let oScore = 0;
let catScore = 0;
let submit = document.querySelector('#submit');
submit.addEventListener('click', function (event) {
	event.preventDefault();
	if (mark && difficulty) {modalStart.style.display = 'none'}
	else if (!mark) (alert("Please choose a team."))
	else if (!difficulty) (alert("Please choose a difficulty"));
	else (alert("Please choose a team and a difficulty"));
});

let xRadio = document.querySelector('#xRadio');
let oRadio = document.querySelector('#oRadio');
let hardRadio = document.querySelector("#hardRadio");
let easyRadio = document.querySelector("#easyRadio");


xRadio.addEventListener('click', function (event) {changeMark(event)});
oRadio.addEventListener('click', function (event) {changeMark(event)});
hardRadio.addEventListener('click', function (event) {changeDifficulty(event)});
easyRadio.addEventListener('click', function (event) {changeDifficulty(event)});

function changeMark (state) {
	mark = event.target.value;
}
function changeDifficulty (event) {
	difficulty = event.target.value;
}
////Select space function =======================
let squares = document.querySelectorAll('.hash > .row > .column-4');

squares.forEach(function(square) {
	square.addEventListener('click', addMark)
})
function addMark (event) {
	event.target.parentNode.setAttribute('data-value', mark);

	let pElem = event.target.parentNode.querySelector('p');
	let svg = new Mark(mark);

	event.target.parentNode.replaceChild(svg, pElem);
	getBoard();
	full(board);
	scorer(board, mark);
	if (!full(board) && !isWinner) { AIMove(); }
}

function Mark (team) {
	function BaseMark () {
		let baseMark = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
		baseMark.setAttribute('viewBox', "0, 0, 10, 10")
		return baseMark;
	}

	let mark = new BaseMark;

	if (team === "X") {
		let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
		path.setAttribute('d', "M9 1L1 9 M9 9L1 1");
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke', '#fff');
		path.setAttribute('stroke-width', '.3');
		path.setAttribute('stroke-linecap', 'round');

		mark.appendChild(path);
	} else {
		let mainColor = getComputedStyle(document.body).backgroundColor;
		let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
		circle.setAttribute('cx', '5');
		circle.setAttribute('cy', '5');
		circle.setAttribute('r', '4.6');
		circle.setAttribute('stroke', "#fff");
		circle.setAttribute('stroke-width', ".4");
		circle.setAttribute('fill', mainColor);

		mark.appendChild(circle);
	}
	return mark
}


//End Game Function ===========================
let modalEnd = document.querySelector('#modal-end');
function full (board) {
	let count = 0;
	for (var key in board) {
		if (board[key] != 'false') {
			count++;
		} 
	}
	if (count == 9) {
		return true;
	} else {
		return false;
	}
}

function checkForWinner (board, currentPlayer) {
	let result;
	patterns = {
		a: [1,2,3],
		b: [4,5,6],
		c: [7,8,9],
		d: [1,4,7],
		e: [2,5,8],
		f: [3,6,9],
		g: [1,5,9],
		h: [3,5,7]
	}
	function checker (pattern) {
		square1 = patterns[pattern][0];
		square2 = patterns[pattern][1];
		square3 = patterns[pattern][2];

		mark1 = board[square1];
		mark2 = board[square2];
		mark3 = board[square3];

		if (mark1 == currentPlayer && mark2 == currentPlayer && mark3 == currentPlayer) {
			result = true;
		} else {
			return false;
		}
	}

	for (var pattern in patterns) {
		checker(pattern);
	}
	return result;
}

function scorer (board, currentPlayer) {
	if (checkForWinner(board, currentPlayer) === true) {
		isWinner = true;
		winner = currentPlayer;
		endGame(currentPlayer + ' wins!', currentPlayer);
	};
	if (isWinner == false &&  full(board)) {
		endGame('Cats Game')
	}

}
function endGame (winMark, winner) {
	if (isWinner) {
		winner == 'X'? xScore++ : oScore++;
	} else {
		catScore++;
	}
	modalEnd.style.display = 'block';

	let winDisplay = modalEnd.querySelector('span');
	winDisplay.innerHTML = winMark;	

	document.querySelector('#xScore').textContent = xScore;
	document.querySelector('#oScore').textContent = oScore;
}
//AI ==========================================
let board = {};
function getBoard () {
	squares.forEach (function (square) {
		let key = square.id;
		let dataValue = square.getAttribute('data-value');
		board[key] = dataValue;

	});

}
function getAvailable (board) {
	let result = {};
	for (var key in board) {
		if (board.hasOwnProperty(key)) {
			if (board[key] === "false") {
				result[key] = board[key];
			}
		}
	}
	return result;
}
function AIMove () {
	comMark = ( mark == "X" ) ? "O" : "X";
	//function to place the AI's mark on the board
	function addAIMark (move) {

		document.querySelector('#' + CSS.escape(move)).setAttribute('data-value', comMark);
		let pElem = document.querySelector('#' + CSS.escape(move)).querySelector('p');

		let svg = new Mark(comMark);

		document.querySelector('#' + CSS.escape(move)).replaceChild(svg, pElem);
	}

	function easyAI () {

		//make an object of available spaces
		let available = getAvailable(board);
		console.log(available);
		//select a random space and mark it
		let numberRemaining = Object.keys(available).length;
		console.log(numberRemaining);
    
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    
		function getRandomInt(max) {
			return Math.floor(Math.random() * Math.floor(max));
		}
		let random = getRandomInt(numberRemaining);
		let randomSquare = Object.keys(available)[random];
		addAIMark(randomSquare);



	}//end easyAI

	//hardAI is an implimentation of the minimax algorythm
	//Jason Fox
	//https://www.neverstopbuilding.com/blog/2013/12/13/tic-tac-toe-understanding-the-minimax-algorithm13/
  //further guidance from:
  //Ahmad Abdolsaheb
  //https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
	function hardAI (testBoard, currentPlayer)  {
		//call the minimax function and store its result in option
		let move = minimax(testBoard, currentPlayer);
		move = move["index"];

		//place the move on the board
		addAIMark(move);
		function minimax (testBoard, currentPlayer) {
			//get the empty squares and store them in avilable
			let available = getAvailable(board);

			//store the rusult of the full function before running the rest of minimax so
			//that the final else if works
			let isFull = full(testBoard);
			//check if any of the available squares create win states and set score
			if (checkForWinner(testBoard, mark)) {
				return {score:-10};
			} else if (checkForWinner(testBoard, comMark)) {
				return {score:10};
			} else if (isFull) {
				return {score:0};
			}

			//store the options and their score in the options array
			let options = [];

			//loop through all of the available squares
			for (let square in available) {
				//create a option object and set its index to the current square's
				let option = {};

				option.index = square;

				//mark the testBoard with the currentPlayer's mark as a test
				testBoard[square] = currentPlayer;

				//if the currentPlayer is the computer recursively call the minimax function on the testBoard with
				// the score for the human stored in the option
				if (currentPlayer == comMark) {
					let result = minimax(testBoard, mark);
					option.score = result.score;
				} else { //otherwise call minimax with the board scored for the computer
					let result = minimax(testBoard, comMark);
					option.score = result.score;
				}

				//reset the square back to blank/empty
				testBoard[square] = "false";

				options.push(option);
			}

			//find the best option by reducing the options array
			//if the computer is the currentPlayer find the greatest score possible
			//if human, find the opposite 
			let reducer = function (accumulator, currentValue) {
				if (currentPlayer === comMark) {
					if (currentValue.score > accumulator.score)  {
						return currentValue;
					} else {
					return accumulator;
					}
				}
				else {
					if (currentValue.score < accumulator.score) {
						return currentValue;					
					} else {
					return accumulator;
					}
				}


			}
			let bestMove = options.reduce(reducer);

			return bestMove;
		}
	} //end hardAI


	getBoard();
	if (difficulty == 'easy') {
		easyAI();
	} else {
		hardAI(board, comMark);
	};
	getBoard();
	full(board);
	scorer(board, comMark);
}
// Restart Function ===========================
let newGameBut = document.querySelector('#new-game');
newGameBut.addEventListener('click', newGame);
function newGame () {
	isWinner = false;
	//drop the modal
	modalEnd.style.display = 'none';
	//clear the board

	let P = function () {
		return document.createElement('p');
	}


	squares.forEach(function (square) {
		square.setAttribute('data-value', 'false');
		while(square.firstChild) {
			square.removeChild(square.firstChild);
		}
		let pElem = new P();
		square.appendChild(pElem);
	})
	//set the score
}
