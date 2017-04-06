

$(document).ready(function(){
console.log('eeeeeeeyyoooo');
}

/*
	Object State represents a state in the game
	Delegate to this object if you want to gain access to its behavior
*/
var State = {
	/*
		Initialize or Copy the properties of a new State
		@param old [State]: old state used to initialize the new State
	*/
	newState: function(old){

		// the player who has the turn to play
		this.turn = "";
		
		// the number of moves of the AI player
		this.aiMovesCount = 0;
		
		// the result the game in this State
		this.result = "still running";
		
		// the board configuration in this State
		this.board = [];

		// if state is initialized using a copy of another state
		if(typeof old !== "undefined"){
			var len = old.board.length;
			this.board = new Array(len);
			for (var i=0; i<len; i++){
				this.board[i] = old.board[i];
			}

			this.aiMovesCount = old.aiMovesCount;
			this.result = old.result;
			this.turn = old.turn;
		}

		// advances the turn of a state
		this.advanceTurn = function(){
			this.turn = this.turn === "X" ? "O" : "X";
		}

		/*
			enumerates the empty cells in state
			@return [Array]: indices of all empty cells
		*/
		this.emptyCells = function(){
			var indxs = [];
			for (var i=0; i<9; i++){
				if (this.board[i] === "E"){
					indxs.push(i);
				}
			}
			return indxs;
		}

		/*
			Checks if the state is a terminal state or not
			the state result is updated to reflect the result of the game
			@returns [Boolean]: true if it's terminal, false otherwise
		*/
		this.isTerminal = function(){
			var b = this.board;

			//check rows
			for (var i=0; i<=6; i+=3){
				if (b[i] !== "E" && b[i] === b[i+1] && b[i+1] === b[i+2]){
					this.result = b[i] + "-won"; //update the state result
					return true;
				}
			}

			//check columns
			for (var i=0; i<=2; i++){
				if(b[i] !== "E" && b[i] === b[i+3] && b[i+3] === b[i+6]){
					this.result = b[i] + "-won"; //update the state result
					return true;
				}
			}

			//check diagonals
			for (var i=0, j=4; i<=2; i+=2, j-=2){
				if(b[i] !== "E" && b[i] == b[i+j] && b[i+j] === b[i+2*j] ){
					this.result = b[i] + "-won";
					return true;
				}
			}

			var available = this.emptyCells();
			if (available.length == 0){
				// the game is draw
				this.result = "draw";
				return true;
			}
			else {
				return false;
			}
		}
	}
};

//create a new Object newState and link it to State Object
var newState = Object.create(State);
//initialize properties by delegating blankState to State
newState.newState();
//access your new properties
newState.turn=1;

//});