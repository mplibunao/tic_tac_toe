$(document).ready(function(){
	console.log('eeeyy');
});


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

			//check rows
			for (var i=0; i<=6; i+=3){
				if (B[i] !== "E" && B[i] === B[i+1] && B[i+1] === B[i+2]){
					this.result = B[i] + "-won"; //update the state result
					return true;
				}
			}

			//check columns
			for (var i=0; i<=2; i++){
				if(B[i] !== "E" && B[i] === B[i+3] && B[i+3] === B[i+6]){
					this.result = B[i] + "-won"; //update the state result
					return true;
				}
			}

			//check diagonals
			for (var i=0, j=4; i<=2; i+=2, j-=2){
				if(B[i] !== "E" && B[i] == B[i+j] && B[i+j] === B[i+2*j] ){
					this.result = B[i] + "-won";
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
	 score : function(_state){
	 	if(_state.result === "X-won"){
        	// the x player won
        	return 10 - _state.aiMovesCount;
	    }
	    else if(_state.result === "O-won") {
	        //the x player lost
	        return - 10 + _state.aiMovesCount;
	    }
	    else {
	        //it's a draw
	        return 0;
	    }

	}
};

/*		end game.js		*/


/*			ai.js			*/



var AIAction = {

	/*
	 * Initializes action that the ai player could make
	 * @param pos [Number]: the cell position the ai would make its action in
	 * made that action
	 */
	 initializeAction: function(pos){

	 	// public : the position on the board that the action would put the letter on
	    this.movePosition = pos;

	    //public : the minimax value of the state that the action leads to when applied
	    this.minimaxVal = 0;

	    /*
	     * public : applies the action to a state to get the next state
	     * @param state [State]: the state to apply the action to
	     * @return [State]: the next state
	     */
	    this.applyTo = function(state) {
	    	var next = Object.create(State);
	    	next.newState(state)
	    	//console.log(next.board);
	    	//console.log('changing board');
	    	//console.log(this.movePosition +" : " + state.turn );
	        //put the letter on the board
	        next.board[this.movePosition] = state.turn;
	        //console.log(next.board);

	        if(state.turn === "O")
	            next.aiMovesCount++;

	        next.advanceTurn();

	        return next;
	    }
	 },

		 /*
		 * public static function that defines a rule for sorting AIActions in ascending manner
		 * @param firstAction [AIAction] : the first action in a pairwise sort
		 * @param secondAction [AIAction]: the second action in a pairwise sort
		 * @return [Number]: -1, 1, or 0
		 */
		ASCENDING : function(firstAction, secondAction) {
			console.log('first action');
			console.log(firstAction);
			console.log('second action')
			console.log(secondAction);
		    if(firstAction.minimaxVal < secondAction.minimaxVal)
		        return -1; //indicates that firstAction goes before secondAction
		    else if(firstAction.minimaxVal > secondAction.minimaxVal)
		        return 1; //indicates that secondAction goes before firstAction
		    else
		        return 0; //indicates a tie
		},

		/*
		 * public static function that defines a rule for sorting AIActions in descending manner
		 * @param firstAction [AIAction] : the first action in a pairwise sort
		 * @param secondAction [AIAction]: the second action in a pairwise sort
		 * @return [Number]: -1, 1, or 0
		 */
		DESCENDING : function(firstAction, secondAction) {
			console.log('first action');
			console.log(firstAction);
			console.log('second action')
			console.log(secondAction);
		    if(firstAction.minimaxVal > secondAction.minimaxVal)
		        return -1; //indicates that firstAction goes before secondAction
		    else if(firstAction.minimaxVal < secondAction.minimaxVal)
		        return 1; //indicates that secondAction goes before firstAction
		    else
		        return 0; //indicates a tie
		}

};

/*

*/
var AI = {

	/*
		Initializes an AI player with a specific level of intelligence
		@param level [String]: the desired level of intelligence
	*/
	initAI: function(level){

		//private attribute: level of intelligence the player has
		var levelOfIntelligence = level;

		//private attribute: the game the player is playing
		var game = {};

		/*
	     * private recursive function that computes the minimax value of a game state
	     * @param state [State] : the state to calculate its minimax value
	     * @returns [Number]: the minimax value of the state
	     */
	    function minimaxValue(state) {
	    	//console.log(state);
	        if(state.isTerminal()) {
	            //a terminal game state is the base case
	            return Game.score(state);
	        }
	        else {
	            var stateScore; // this stores the minimax value we'll compute

	            if(state.turn === "X")
	            // X wants to maximize --> initialize to a value smaller than any possible score
	                stateScore = -1000;
	            else
	            // O wants to minimize --> initialize to a value larger than any possible score
	                stateScore = 1000;

	            var availablePositions = state.emptyCells();
	            //console.log("available positions");
	            //console.log(availablePositions);
	            //enumerate next available states using the info form available positions
	            var availableNextStates = availablePositions.map(function(pos) {
	            	//var action = new AIAction(pos);
	            	var action = Object.create(AIAction);
	            	action.initializeAction(pos);
	                //console.log("applying state");
	                var nextState = action.applyTo(state);
	                //console.log(nextState);
	                return nextState;
	            });
	            //console.log('here are all the available next states');
	            //console.log(availableNextStates);
	            /* calculate the minimax value for all available next states
	             * and evaluate the current state's value */
	            availableNextStates.forEach(function(nextState) {
	                var nextScore = minimaxValue(nextState);
	                if(state.turn === "X") {
	                    // X wants to maximize --> update stateScore iff nextScore is larger
	                    if(nextScore > stateScore)
	                        stateScore = nextScore;
	                }
	                else {
	                    // O wants to minimize --> update stateScore iff nextScore is smaller
	                    if(nextScore < stateScore)
	                        stateScore = nextScore;
	                }
	            });

	            return stateScore;
	        }
	    }


		/*
			private function: make the ai player take a blink move
			that is: choose the cell to place its symbol randomly
			@param turn [String]: the player to play, either X or O
		*/
		function takeABlindMove(turn){
			var available = game.currentState.emptyCells();
	        var randomCell = available[Math.floor(Math.random() * available.length)];
	        var action = Object.create(AIAction);
	        action.initializeAction(randomCell);
	        //var action = new AIAction(randomCell);

	        var next = action.applyTo(game.currentState);

	        ui.insertAt(randomCell, turn);

	        game.advanceTo(next);
		}

		/*
			private function: make the ai player take a novice move,
			that is mix between choosing the optimal and suboptimal minimax decisions
			@param turn [String]: the player to play, either X or O
		*/
		function takeANoviceMove(turn){
			var available = game.currentState.emptyCells();

	        //enumerate and calculate the score for each available actions to the ai player
	        var availableActions = available.map(function(pos) {
	        	//create the action object
	        	//var action =  new AIAction(pos);
	        	var action = Object.create(AIAction);
	        	action.initializeAction(pos);
	            var nextState = action.applyTo(game.currentState); //get next state by applying the action

	            action.minimaxVal = minimaxValue(nextState); //calculate and set the action's minimax value

	            return action;
	        });

	        //sort the enumerated actions list by score
	        if(turn === "X")
	        	
	        //X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
	            availableActions.sort(AIAction.DESCENDING);
	        else
	        	
	        //O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
	            availableActions.sort(AIAction.ASCENDING);

	        /*
	         * take the optimal action 40% of the time, and take the 1st suboptimal action 60% of the time
	         */
	        var chosenAction;
	        if(Math.random()*100 <= 40) {
	            chosenAction = availableActions[0];
	        }
	        else {
	            if(availableActions.length >= 2) {
	                //if there is two or more available actions, choose the 1st suboptimal
	                chosenAction = availableActions[1];
	            }
	            else {
	                //choose the only available actions
	                chosenAction = availableActions[0];
	            }
	        }
	        var next = chosenAction.applyTo(game.currentState);

	        ui.insertAt(chosenAction.movePosition, turn);

	        game.advanceTo(next);
		}

		/*
			private function: make the ai player take a master move,
			that is choose the optimal minimax decisions
			@param turn [String]: the player to play, either X or O
		*/
		function takeAMasterMove(turn){
			var available = game.currentState.emptyCells();

	        //enumerate and calculate the score for each avaialable actions to the ai player
	        var availableActions = available.map(function(pos) {
	        	//create the action object
	        	var action = Object.create(AIAction);
	        	action.initializeAction(pos);
	            //var action =  new AIAction(pos); 
	            //get next state by applying the action
	            var next = action.applyTo(game.currentState); 

	            action.minimaxVal = minimaxValue(next); //calculate and set the action's minmax value

	            return action;
	        });

	        //sort the enumerated actions list by score
	        if(turn === "X")
	        //X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
	            availableActions.sort(AIAction.DESCENDING);
	        else
	        //O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
	            availableActions.sort(AIAction.ASCENDING);


	        //take the first action as it's the optimal
	        var chosenAction = availableActions[0];
	        var next = chosenAction.applyTo(game.currentState);

	        ui.insertAt(chosenAction.movePosition, turn);	//ALERT I DON"T HAVE THIS SHIT

	        game.advanceTo(next);
		}

		/*
	     * public method to specify the game the ai player will play
	     * @param _game [Game] : the game the ai will play
	     */
	    this.plays = function(_game){
	        game = _game;
	    };

		/*
	     * public function: notify the ai player that it's its turn
	     * @param turn [String]: the player to play, either X or O
	     */
	    this.notify = function(turn) {
	        switch(levelOfIntelligence) {
	            //invoke the desired behavior based on the level chosen
	            case "blind": takeABlindMove(turn); break;
	            case "novice": takeANoviceMove(turn); break;
	            case "master": takeAMasterMove(turn); break;
	        }
	    }
	}

};


/*		end ai.js			*/


/*		control.js		*/

/*
 * object to contain all items accessable to all control functions
 */
var globals = {};

/*
 * choosing difficulty level (onclick span.level) behavior and control
 * when a level is clicked, it becomes highlighted and the "ai.level" variable
 * is set to the chosen level
 */
$(".level").each(function() {
    var $this = $(this);
    $this.click(function() {
        $('.selected').toggleClass('not-selected');
        $('.selected').toggleClass('selected');
        $this.toggleClass('not-selected');
        $this.toggleClass('selected');

        //SETS ai.level PROPERTY HERE WHATEVER IT IS.
        ai.level = $this.attr("id");
    });
});

/*
 * start game (onclick div.start) behavior and control
 * when start is clicked and a level is chosen, the game status changes to "running"
 * and UI view to swicthed to indicate that it's human's trun to play
 */
$(".start").click(function() {
    var selectedDiffeculty = $('.selected').attr("id");
    if(typeof selectedDiffeculty !== "undefined") {

        // CONSTRUCTOR CALL HERE. INITIALIZING OBJECTS WHEN YOU PRESS STARTTTT

        //var aiPlayer = new AI(selectedDiffeculty);
        var aiPlayer = Object.create(AI);
        aiPlayer.initAI(selectedDiffeculty);

        //globals.game = new Game(aiPlayer);
        globals.game = Object.create(Game);
        globals.game.initGame(aiPlayer);

        aiPlayer.plays(globals.game);

        globals.game.start();
    }
});

/*
 * click on cell (onclick div.cell) behavior and control
 * if an empty cell is clicked when the game is running and its the human player's trun
 * get the indecies of the clickd cell, craete the next game state, upadet the UI, and
 * advance the game to the new created state
 */
 $(".cell").each(function() {
     var $this = $(this);
     $this.click(function() {
         if(globals.game.status === "running" && globals.game.currentState.turn === "X" && !$this.hasClass('occupied')) {
             var indx = parseInt($this.data("indx"));

             //var next = new State(globals.game.currentState);
             var next = Object.create(State);
             next.newState(globals.game.currentState)
             
             next.board[indx] = "X";

             ui.insertAt(indx, "X");

             next.advanceTurn();

             globals.game.advanceTo(next);

         }
     })
 });

/*		end control.js		*/