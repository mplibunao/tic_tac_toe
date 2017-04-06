

//$(document).ready(function(){

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


/*
 * Initializes a game object to be played
 * @param autoPlayer [AIPlayer] : the AI player to be play the game with
 */
var Game ={

	initGame : function(autoPlayer){
		//public : initialize the ai player for this game
	    this.ai = autoPlayer;

	    // public : initialize the game current state to empty board configuration
	    this.currentState = Object.create(State);
	    this.currentState.newState();

	    //"E" stands for empty board cell
	    this.currentState.board = ["E", "E", "E",
	                               "E", "E", "E",
	                               "E", "E", "E"];

	    this.currentState.turn = "X"; //X plays first

	    /*
	     * initialize game status to beginning
	     */
	    this.status = "beginning";

	    /*
	     * public function that advances the game to a new state
	     * @param _state [State]: the new state to advance the game to
	     */
	    this.advanceTo = function(_state) {
	        this.currentState = _state;
	        if(_state.isTerminal()) {
	            this.status = "ended";

	            if(_state.result === "X-won")
	                //X won
	                ui.switchViewTo("won");				//HEY I DON"T HAVE THIS
	            else if(_state.result === "O-won")
	                //X lost
	                ui.switchViewTo("lost");
	            else
	                //it's a draw
	                ui.switchViewTo("draw");
	        }
	        else {
	            //the game is still running

	            if(this.currentState.turn === "X") {
	                ui.switchViewTo("human");
	            }
	            else {
	                ui.switchViewTo("robot");

	                //notify the AI player its turn has come up
	                this.ai.notify("O");
	            }
	        }
	    };

	    /*
	     * starts the game
	     */
	    this.start = function() {
	        if(this.status = "beginning") {
	            //invoke advanceTo with the initial state
	            this.advanceTo(this.currentState);
	            this.status = "running";
	        }
	    }
	},

	/*
	 * public static function that calculates the score of the x player in a given terminal state
	 * @param _state [State]: the state in which the score is calculated
	 * @return [Number]: the score calculated for the human player
	 */
	 score : function(){
	 	if(_state.result === "X-won"){
        	// the x player won
        	return 10 - _state.oMovesCount;
	    }
	    else if(_state.result === "O-won") {
	        //the x player lost
	        return - 10 + _state.oMovesCount;
	    }
	    else {
	        //it's a draw
	        return 0;
	    }

	}
};



//});