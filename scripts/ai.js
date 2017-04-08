"use strict"

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

	        if(state.turn === globals.game.p2)	 // Not sure about this.
	        	//INSERT CHECK FOR AI OR HUMAN
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
			//console.log('first action');
			//console.log(firstAction);
			//console.log('second action')
			//console.log(secondAction);
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
			//console.log('first action');
			//console.log(firstAction);
			//console.log('second action')
			//console.log(secondAction);
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

	            if(state.turn === globals.game.p1) 	//NOT SURE ABOUT THIS
	            // X wants to maximize --> initialize to a value smaller than any possible score
	        	// Player wants to maximize --> initialize to a value smaller than any possible score
	                stateScore = -1000;
	            else
	            // O wants to minimize --> initialize to a value larger than any possible score
	        	// AI wants to minimize --> initialize to a value larger than any possible score
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
	                if(state.turn === globals.game.p1) {
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
	        //if(turn === "X")
	        if(turn === globals.game.p1)	
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
	            //console.log(action.minimaxVal);
	            return action;
	        });
	        //console.log(availableActions);
	        //sort the enumerated actions list by score
	        if(turn === globals.game.p1)
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