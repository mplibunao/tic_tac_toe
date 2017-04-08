


// ui object will contain all the methods for ui manipulation
var ui = {};

/*	Open Player Num Modal Dialog */
ui.showPlayerNumModal = function showPlayerNumModal(){
	$('#player-num-modal').modal("show");
};

/*	hide Player Num Modal Dialog */
ui.hidePlayerNumModal = function hidePlayerNumModal(){
	$('#player-num-modal').modal("show");
};

/*	Open Marker Modal Dialog */
ui.showMarkerModal = function showMarkerModal(){
	$('#marker-modal').modal("show");
};

/*	hide Marker Modal Dialog */
ui.hideMarkerModal = function hideMarkerModal(){
	$('#marker-modal').modal("hide");
}

/*	Open AI Modal Dialog */
ui.showAIModal = function showAIModal(){
	$('#AI-modal').modal("show");
}
/*	hide AI Modal Dialog */
ui.hideAIModal = function hideAIModal(){
	$('#AI-modal').modal('hide');
}


/*
	Switches the view of the page depending on the state or status of the game.
	@ param [view] - the current state of the game to which the ui must change to
	Note: Has hidden parameters for when the game has ended. To be passed to checkWinningMove function
	@ param [state] - the state of the game when it ended
	@ param [result] - the marker of the winner
*/
ui.switchViewTo = function switchViewTo(view){

	switch(view){
		case "playerOne":
			$('.turnIndicator').html('Your Turn');
			$('#header').html('Your Turn');
			break;
		case "playerTwo":
			$('.turnIndicator').html('Computer\'s turn');
			$('#header').html('Computer\'s turn');
			break;
		case "won":
			var params = Array.prototype.slice.call(arguments);
			var state = params[1];
			var result = params[2];
			ui.checkWinningMove(state, result);

			//change the content of the header to announce the winner then pass in the array to pulsate for animation
			$('#header').html('Player One Wins');
			ui.addEffect('#header', 'pulsate', 3, 1200);

			
			break;
		case "lost":
			var params = Array.prototype.slice.call(arguments);
			var state = params[1];
			var result = params[2];
			ui.checkWinningMove(state, result);

			$('#header').html('Computer Wins');
			ui.addEffect('#header', 'pulsate', 3, 1200);
			
			
			
			break;
		case "draw":
			var params = Array.prototype.slice.call(arguments);
			var state = params[1];
			var result = params[2];
			ui.checkWinningMove(state, result);

			$('#header').html('It\'s a draw');
			ui.addEffect('#header', 'pulsate', 3, 1200);
			
			
			break;
	}
}


/*
	checks the markers on the board when a result has been declared
	@param [state] - current state of the game when it ended. Contains the board property which we will access
	@param [result] - "X" or "O" representing the marker of the winner or the string "tie" for a draw game
	Pushes all the board index of the winner's marker or all the indexes in the event of a tie to winningMove array
	Calls pulsate to light up the users sky
*/
ui.checkWinningMove = function checkWinningMove(state, result){

	var board = state.board;
	var winningMove = [];

	if (result !== "tie"){
		for (let i=0; i<10; i++){
			if (board[i] === result){
				winningMove.push(i);
			}
		}
	} else{
		for (let i=0; i<10; i++){
			winningMove.push(i);
		}
	}
ui.pulsate(winningMove);

};

/*	@ Wraps the parameters into a jQuery object and adds an effect to it
	@ If a current animation is already running, then simply exit the function and return;
	@ Id is the name of the object including the . for classes and # for ids
	@ effect is the name of the effect
	@ number is the number of times the effect will be used
	@ timing is the duration of the effect
*/
ui.addEffect = function(id, effect, number, timing){
	var jqueryObject = $(id);
	if (jqueryObject.is(':animated')){
		//do nothing and end function
		return;
	}
	jqueryObject.effect(effect, {times:number}, timing);
}


/*
	Calls addEffect function to show pulsate animation
	Applies the pulsate effect on the given cells
	@param array contains the cell number of the winning moves or all the cell number in the case of a tie
*/
ui.pulsate = function(array){
	array.map(function(id){
		ui.addEffect('#cell-'+id, 'pulsate', 3, 1200);
	});
	/*
	for (let i=0; i<array.length; i++){
		addEffect('#cell-'+i, 'pulsate', 3, 1200);
	}
	*/
}

//insert marker at the specified position in the board
ui.insertAt = function insertAt(pos, turn){
	var cellNum = "#cell-"+pos;
	var turnHTML = "<h1 class='marker'>" + turn + "</h1>";
	$(cellNum).addClass("occupied").html(turnHTML);
}

ui.setPlayers = function(){
	$('.match-up').html("Player 1 vs Computer");
}

ui.loadingScreen = function(){
	$('#header').html('Loading Game..')
}


$(document).ready(function(){
	ui.showMarkerModal();
});