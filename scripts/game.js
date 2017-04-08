
/*		game.js		*/

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
			var B = this.board;
			var moveOfTheGame = [];
			//check rows
			for (var i=0; i<=6; i+=3){
				if (B[i] !== "E" && B[i] === B[i+1] && B[i+1] === B[i+2]){
					this.result = B[i]; //"-won"; update the state result
					return true;
				}
			}

			//check columns
			for (var i=0; i<=2; i++){
				if(B[i] !== "E" && B[i] === B[i+3] && B[i+3] === B[i+6]){
					this.result = B[i]; //update the state result
					return true;
				}
			}

			//check diagonals
			for (var i=0, j=4; i<=2; i+=2, j-=2){
				if(B[i] !== "E" && B[i] == B[i+j] && B[i+j] === B[i+2*j] ){
					this.result = B[i];
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
	    
	    function getRandomIntInclusive(min, max) {
  			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// randomize who goes first
	    if (getRandomIntInclusive(1,10) >= 6){
	    	this.currentState.turn = "X";
	    } else{
	    	this.currentState.turn = "O";
	    }

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

	            if(_state.result === this.p1){
	            	//player 1 won
	            	//ui.checkWinningMove(_state, this.p1);
	                ui.switchViewTo("won", _state, this.p1);	
	            }
	            else if(_state.result === this.p2){
	            	//player 1 lost
	            	//ui.checkWinningMove(_state, this.p2);
	                ui.switchViewTo("lost", _state, this.p2);
	            }
	            else
	            	//it's a draw
	            	//ui.checkWinningMove(_state, 'tie');
	                ui.switchViewTo("draw", _state, 'tie');
	            
	                
	        }
	        else {
	            //the game is still running

	            if(this.currentState.turn === this.p1) {
	                ui.switchViewTo("playerOne");
	            }
	            else {
	                ui.switchViewTo("playerTwo");

	                //notify the AI player its turn has come up
	                this.ai.notify(this.p2);
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
	 score : function(_state){
	 	if(_state.result === globals.game.p1){
        	// the x player won
        	return 10 - _state.aiMovesCount;
	    }
	    else if(_state.result === globals.game.p2) {
	        //the x player lost
	        return - 10 + _state.aiMovesCount;
	    }
	    else {
	        //it's a draw
	        return 0;
	    }

	},

	/*
		Initialize the players
	*/
	initMarkers : function initMarkers(p1Marker, p2Marker){
		this.p1 = p1Marker;
		this.p2 = p2Marker;
	}
};

/*		end game.js		*/